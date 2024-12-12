import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Groq from 'groq-sdk'; // Ensure the Groq SDK is installed and configured properly
import Ajv from 'ajv';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv();

const schema = {
  properties: {
    name: { title: "Full Name", type: "string" },
    email: { title: "Email Address", type: "string" },
    phone: { title: "Phone Number", type: "string" },
    // gender: { title: "Gender", type: "string" },
    // dateOfBirth: { title: "Date of Birth", type: "string", format: "date" },
  //   highestQualification: { title: "Highest Qualification", type: "string" },
  //   institution: { title: "Institution", type: "string" },
  //   cgpa: { title: "CGPA", type: "string" },
  //   graduationYear: { title: "Graduation Year", type: "string" },
  //   class12Marks: { title: "Class 12 Marks", type: "string" },
  //   class12Board: { title: "Class 12 Board", type: "string" },
  //   class12YearOfPassing: { title: "Class 12 Year of Passing", type: "string" },
  //   class10Marks: { title: "Class 10 Marks", type: "string" },
  //   class10Board: { title: "Class 10 Board", type: "string" },
  //   class10YearOfPassing: { title: "Class 10 Year of Passing", type: "string" },
   },
  required: ["name", "email", "phone"],
  title: "Resume Data",
  type: "object",
};

export async function extractResumeData(file) {
  try {
    // Extract text from the resume file
    const resumeText = await extractTextFromResume(file);

    // Perform NER using Groq LLM
    const extractedData = await extractResumeEntities(resumeText);

    return extractedData;
  } catch (error) {
    console.error('Error in extractResumeData:', error);
    throw error;
  }
}

async function extractTextFromResume(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.pdf') {
    return await extractTextFromPDF(file);
  } else if (ext === '.docx' || ext === '.doc') {
    return await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported resume file format.');
  }
}

async function extractTextFromPDF(file) {
  const data = await pdfParse(file.buffer);
  return data.text;
}

async function extractTextFromDOCX(file) {
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
}

async function extractResumeEntities(resumeText) {
  const jsonSchema = JSON.stringify(schema, null, 4);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an assistant that extracts structured information from resumes. The JSON object must use the schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: `Extract the relevant information from the following resume text:\n\n${resumeText}`,
      },
    ],
    model: "llama-3.3-70b-versatile", // Replace with the appropriate model
    temperature: 0.05,
    stream: false,
    response_format: { type: "json_object" },
  });

  // Handle the response
  const responseContent = chatCompletion.choices[0].message.content;
  let extractedData;

  try {
    extractedData = JSON.parse(responseContent);
  } catch (error) {
    console.error('LLM response:', responseContent);
    throw new Error('Failed to parse LLM response as JSON.');
  }

  // Validate extracted data against the schema
  const validate = ajv.compile(schema);
  const valid = validate(extractedData);

  if (!valid) {
    console.error('Validation errors:', validate.errors);
    throw new Error('Extracted data does not match the schema.');
  }

  return extractedData;
}
