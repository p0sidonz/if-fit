// utils/codeGenerators.js

export const generateControllerCode = (model, permissions) => {
    const className = `${capitalize(model.name)}Controller`;
    const routePath = model.name.toLowerCase();
    
    return `
  import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
  import { ${className}Service } from './${model.name.toLowerCase()}.service';
  import { Create${capitalize(model.name)}Dto, Update${capitalize(model.name)}Dto } from './${model.name.toLowerCase()}.dto';
  import { ${className}Guard } from './${model.name.toLowerCase()}.guard';
  
  @Controller('${routePath}')
  export class ${className} {
    constructor(private readonly ${model.name.toLowerCase()}Service: ${className}Service) {}
  
    @Post()
    @UseGuards(${className}Guard)
    async create(@Body() create${capitalize(model.name)}Dto: Create${capitalize(model.name)}Dto) {
      return this.${model.name.toLowerCase()}Service.create(create${capitalize(model.name)}Dto);
    }
  
    @Get()
    @UseGuards(${className}Guard)
    async findAll() {
      return this.${model.name.toLowerCase()}Service.findAll();
    }
  
    @Get(':id')
    @UseGuards(${className}Guard)
    async findOne(@Param('id') id: string) {
      return this.${model.name.toLowerCase()}Service.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(${className}Guard)
    async update(@Param('id') id: string, @Body() update${capitalize(model.name)}Dto: Update${capitalize(model.name)}Dto) {
      return this.${model.name.toLowerCase()}Service.update(id, update${capitalize(model.name)}Dto);
    }
  
    @Delete(':id')
    @UseGuards(${className}Guard)
    async remove(@Param('id') id: string) {
      return this.${model.name.toLowerCase()}Service.remove(id);
    }
  }
    `;
  };
  
  export const generateServiceCode = (model) => {
    const className = `${capitalize(model.name)}Service`;
    
    return `
  import { Injectable } from '@nestjs/common';
  import { Create${capitalize(model.name)}Dto, Update${capitalize(model.name)}Dto } from './${model.name.toLowerCase()}.dto';
  
  @Injectable()
  export class ${className} {
    create(create${capitalize(model.name)}Dto: Create${capitalize(model.name)}Dto) {
      return 'This action adds a new ${model.name.toLowerCase()}';
    }
  
    findAll() {
      return 'This action returns all ${model.name.toLowerCase()}s';
    }
  
    findOne(id: string) {
      return \`This action returns a #\${id} ${model.name.toLowerCase()}\`;
    }
  
    update(id: string, update${capitalize(model.name)}Dto: Update${capitalize(model.name)}Dto) {
      return \`This action updates a #\${id} ${model.name.toLowerCase()}\`;
    }
  
    remove(id: string) {
      return \`This action removes a #\${id} ${model.name.toLowerCase()}\`;
    }
  }
    `;
  };
  
  export const generateModuleCode = (model) => {
    const className = `${capitalize(model.name)}Module`;
    
    return `
  import { Module } from '@nestjs/common';
  import { ${capitalize(model.name)}Service } from './${model.name.toLowerCase()}.service';
  import { ${capitalize(model.name)}Controller } from './${model.name.toLowerCase()}.controller';
  
  @Module({
    controllers: [${capitalize(model.name)}Controller],
    providers: [${capitalize(model.name)}Service],
  })
  export class ${className} {}
    `;
  };
  
  export const generateDtoCode = (model) => {
    return `
  export class Create${capitalize(model.name)}Dto {
  ${model.fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
  }
  
  export class Update${capitalize(model.name)}Dto {
  ${model.fields.map(field => `  ${field.name}?: ${field.type};`).join('\n')}
  }
    `;
  };
  
  export const generateGuardCode = (model, permissions) => {
    const className = `${capitalize(model.name)}Guard`;
    
    return `
  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class ${className} implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const method = request.method;
  
      // Implement your permission logic here based on the method and user
      // This is a simplified example
      switch (method) {
        case 'POST':
          return ${permissions.create === 'public' ? 'true' : `user && user.role === '${permissions.create}'`};
        case 'GET':
          return ${permissions.read === 'public' ? 'true' : `user && user.role === '${permissions.read}'`};
        case 'PUT':
        case 'PATCH':
          return ${permissions.update === 'public' ? 'true' : `user && user.role === '${permissions.update}'`};
        case 'DELETE':
          return ${permissions.delete === 'public' ? 'true' : `user && user.role === '${permissions.delete}'`};
        default:
          return false;
      }
    }
  }
    `;
  };
  
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);