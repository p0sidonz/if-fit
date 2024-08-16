
// components/ModelForm.js
import React from 'react';

const ModelForm = ({ model, updateModel, deleteModel }) => {
  const addField = () => {
    const updatedModel = {
      ...model,
      fields: [...model.fields, { name: '', type: 'string' }],
    };
    updateModel(updatedModel);
  };

  const updateField = (index, updatedField) => {
    const updatedFields = [...model.fields];
    updatedFields[index] = updatedField;
    updateModel({ ...model, fields: updatedFields });
  };

  const deleteField = (index) => {
    const updatedFields = model.fields.filter((_, i) => i !== index);
    updateModel({ ...model, fields: updatedFields });
  };

  return (
    <div className="model-form">
      <input
        type="text"
        value={model.name}
        onChange={(e) => updateModel({ ...model, name: e.target.value })}
        placeholder="Model Name"
      />
      <button onClick={deleteModel}>Delete Model</button>
      <h3>Fields:</h3>
      {model.fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            value={field.name}
            onChange={(e) => updateField(index, { ...field, name: e.target.value })}
            placeholder="Field Name"
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, { ...field, type: e.target.value })}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>
          <button onClick={() => deleteField(index)}>Delete Field</button>
        </div>
      ))}
      <button onClick={addField}>Add Field</button>
    </div>
  );
};

export default ModelForm;