// components/SchemaDesigner.js
import React from 'react';
import ModelForm from './ModelForm';

const SchemaDesigner = ({ models, setModels }) => {
  const addModel = () => {
    const newModel = { name: `Model${models.length + 1}`, fields: [] };
    setModels([...models, newModel]);
  };

  const updateModel = (index, updatedModel) => {
    const newModels = [...models];
    newModels[index] = updatedModel;
    setModels(newModels);
  };

  const deleteModel = (index) => {
    const newModels = models.filter((_, i) => i !== index);
    setModels(newModels);
  };

  return (
    <div className="schema-designer">
      <h2>Schema Designer</h2>
      {models.map((model, index) => (
        <ModelForm
          key={index}
          model={model}
          updateModel={(updatedModel) => updateModel(index, updatedModel)}
          deleteModel={() => deleteModel(index)}
        />
      ))}
      <button onClick={addModel}>Add Model</button>
    </div>
  );
};

export default SchemaDesigner;