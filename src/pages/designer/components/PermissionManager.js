// components/PermissionManager.js
import React, { useEffect } from 'react';

const PermissionManager = ({ models, permissions, setPermissions }) => {
  useEffect(() => {
    // Initialize permissions for new models
    const newPermissions = { ...permissions };
    models.forEach(model => {
      if (!newPermissions[model.name]) {
        newPermissions[model.name] = {
          create: 'public',
          read: 'public',
          update: 'public',
          delete: 'public'
        };
      }
    });
    setPermissions(newPermissions);
  }, [models]);

  const updatePermission = (modelName, action, role) => {
    setPermissions(prevPermissions => ({
      ...prevPermissions,
      [modelName]: {
        ...prevPermissions[modelName],
        [action]: role,
      },
    }));
  };

  return (
    <div className="permission-manager">
      <h2>Permission Manager</h2>
      {models.map((model) => (
        <div key={model.name}>
          <h3>{model.name} Permissions:</h3>
          {['create', 'read', 'update', 'delete'].map((action) => (
            <div key={action}>
              <label>{action}:</label>
              <select
                value={permissions[model.name]?.[action] || 'public'}
                onChange={(e) => updatePermission(model.name, action, e.target.value)}
              >
                <option value="public">Public</option>
                <option value="authenticated">Authenticated</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PermissionManager;