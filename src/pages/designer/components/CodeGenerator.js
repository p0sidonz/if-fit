
// components/CodeGenerator.js
import React from 'react';
import { generateControllerCode, generateServiceCode, generateModuleCode, generateDtoCode, generateGuardCode } from './codeGenerators';

const CodeGenerator = ({ models, permissions }) => {
  const generateCode = () => {
    const generatedCode = {};
    models.forEach((model) => {
      generatedCode[`${model.name}Controller.ts`] = generateControllerCode(model, permissions[model.name]);
      generatedCode[`${model.name}Service.ts`] = generateServiceCode(model);
      generatedCode[`${model.name}Module.ts`] = generateModuleCode(model);
      generatedCode[`${model.name}Dto.ts`] = generateDtoCode(model);
      generatedCode[`${model.name}Guard.ts`] = generateGuardCode(model, permissions[model.name]);
    });
    return generatedCode;
  };

  const code = generateCode();

  return (
    <div className="code-generator">
      <h2>Generated Code</h2>
      {Object.entries(code).map(([fileName, fileContent]) => (
        <div key={fileName}>
          <h3>{fileName}</h3>
          <pre>{fileContent}</pre>
          <button onClick={() => navigator.clipboard.writeText(fileContent)}>
            Copy to Clipboard
          </button>
        </div>
      ))}
    </div>
  );
};

export default CodeGenerator;