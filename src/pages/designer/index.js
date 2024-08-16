import React, { useState } from 'react';
import SchemaDesigner from './components/SchemaDesigner';
import PermissionManager from './components/PermissionManager';
import CodeGenerator from './components/CodeGenerator';

const Page = () => {
    const [models, setModels] = useState([]);
    const [permissions, setPermissions] = useState({});
  
    return (
      <div className="app">
        <h1>NestJS Schema and API Generator</h1>
        <SchemaDesigner models={models} setModels={setModels} />
        <PermissionManager 
          models={models} 
          permissions={permissions} 
          setPermissions={setPermissions} 
        />
        <CodeGenerator models={models} permissions={permissions} />
      </div>
    );
};

export default Page;
