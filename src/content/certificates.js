import codexFile from '../../assets/certificados/Certificado Curso Completo de Codex - Udemy.pdf?url';
import awsFile from '../../assets/certificados/Certificación AWS Cloud Practitioner Essentials.pdf?url';
import pythonFile from '../../assets/certificados/certificado Python.pdf?url';
import cambridgeFile from '../../assets/certificados/FCE - Melina Gigena.pdf?url';
import codexPreview from '../assets/certificates/codex.webp';
import awsPreview from '../assets/certificates/aws.webp';
import pythonPreview from '../assets/certificates/python.webp';
import cambridgePreview from '../assets/certificates/cambridge.webp';

export const certificates = [
  { id: 'codex', title: 'Curso Completo de Codex', issuer: 'Udemy', date: 'Octubre de 2026', kind: 'Curso finalizado', file: codexFile, preview: codexPreview, previewWidth: 900, previewHeight: 670, filename: 'Melina-Gigena-Codex.pdf' },
  { id: 'aws', title: 'AWS Cloud Practitioner Essentials', issuer: 'AWS Training & Certification', date: 'Mayo de 2026', kind: 'Curso finalizado', file: awsFile, preview: awsPreview, previewWidth: 901, previewHeight: 696, filename: 'Melina-Gigena-AWS-Essentials.pdf' },
  { id: 'python', title: 'Fundamentos de programación · Python', issuer: 'Consejo Profesional de Ciencias Informáticas de Córdoba', date: 'Diciembre de 2022', kind: 'Certificación', file: pythonFile, preview: pythonPreview, previewWidth: 900, previewHeight: 1273, filename: 'Melina-Gigena-Python.pdf' },
  { id: 'cambridge', title: 'First Certificate in English · B2', issuer: 'Cambridge Assessment English', date: 'Diciembre de 2021', kind: 'Constancia de resultados', file: cambridgeFile, preview: cambridgePreview, previewWidth: 901, previewHeight: 1273, filename: 'Melina-Gigena-Cambridge-B2.pdf' },
];
