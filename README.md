# **CalendarApp**

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## **Project Overview**

- **Project Name:** calendar-app
- **Version:** 0.0.0

## **Development Environment**

To run the development server, use the following command:

```bash
ng serve
```

Then, you can visit [http://localhost:4200/](http://localhost:4200/). The application will automatically reload if you change any of the source files.

## **Docker Setup**

### Prerequisites

- Docker installed on your system
- Docker Compose (optional)

### Building and Running with Docker

1. Build the Docker image:

```bash
docker build -t calendar-app .
```

2. Run the container:

```bash
docker run -p 8080:80 calendar-app
```

The application will be available at [http://localhost:8080](http://localhost:8080)

### Docker Development Tips

- The provided Dockerfile uses multi-stage builds to optimize the image size
- The application runs on Nginx for better performance
- Use the .dockerignore file to exclude unnecessary files from the build context

## **Code Scaffolding**

To generate a new component, you can use the following command:

```bash
ng generate component component-name
```

You can also use similar commands to generate directives, pipes, services, classes, guards, interfaces, enums, or modules.

## **Building the Project**

To build the project, use the following command:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## **Running Unit Tests**

To execute unit tests, run:

```bash
ng test
```

This command will run the tests via [Karma](https://karma-runner.github.io).

## **Running End-to-End Tests**

To execute end-to-end tests, use the following command:

```bash
ng e2e
```

To use this command, you need to first add a package that implements end-to-end testing capabilities.

## **Further Help**

For more help with the Angular CLI, use:

```bash
ng help
```

You can also check out the [Angular CLI Overview and Command Reference](https://angular.io/cli).

## **Project Dependencies**

### **Dependencies**

```json
"dependencies": {
  "@angular/animations": "^17.3.0",
  "@angular/cdk": "^17.3.10",
  "@angular/common": "^17.3.0",
  "@angular/compiler": "^17.3.0",
  "@angular/core": "^17.3.0",
  "@angular/forms": "^17.3.0",
  "@angular/material": "^17.3.10",
  "@angular/platform-browser": "^17.3.0",
  "@angular/platform-browser-dynamic": "^17.3.0",
  "@angular/platform-server": "^17.3.0",
  "@angular/router": "^17.3.0",
  "@angular/ssr": "^17.3.11",
  "express": "^4.18.2",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.14.3"
}
```

### **DevDependencies**

```json
"devDependencies": {
  "@angular-devkit/build-angular": "^17.3.11",
  "@angular-eslint/builder": "17.5.3",
  "@angular-eslint/eslint-plugin": "17.5.3",
  "@angular-eslint/eslint-plugin-template": "17.5.3",
  "@angular-eslint/schematics": "17.5.3",
  "@angular-eslint/template-parser": "17.5.3",
  "@angular/cli": "^17.3.11",
  "@angular/compiler-cli": "^17.3.0",
  "@types/express": "^4.17.17",
  "@types/jasmine": "~5.1.0",
  "@types/node": "^18.18.0",
  "@typescript-eslint/eslint-plugin": "7.11.0",
  "@typescript-eslint/parser": "7.11.0",
  "eslint": "^8.57.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-prettier": "^5.2.1",
  "jasmine-core": "~5.1.0",
  "karma": "~6.4.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0",
  "prettier": "^3.3.3",
  "typescript": "~5.4.2",
  "husky": "^8.0.0"
}
```
