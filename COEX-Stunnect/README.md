
# Set React App

**Author:** [Shubham Sarda](https://www.linkedin.com/in/shubhamsarda/) / [@shubham_ul](https://x.com/shubham_ul)  

---

## Overview

Set React App is a lightweight, opinionated setup for building modern React applications. Inspired by Create React App, it leverages [Vite](https://vitejs.dev/) for blazing-fast bundling, hot module replacement, and a streamlined developer experience. This template provides common tooling and sensible defaults to get you up and running quickly.

---

## Features

- **Vite-Powered**: Enjoy fast bundling, instant dev server start, and on-demand file serving.  
- **Latest React & React DOM**: Includes React and React DOM 18.x for modern React development.  
- **Testing**: Pre-configured with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Jest DOM](https://github.com/testing-library/jest-dom) for robust unit and integration tests.  
- **Simple Scripts**: A minimal set of npm scripts for development, production builds, and previews.  
- **Web Vitals**: Measures performance for React apps, integrated out of the box.  

---

## Steps to Use (Similar to Create React App)

1. **Install Globally (Optional)**  
   ```bash
   npm install -g set-react-app
   ```
   This allows using the `set-react-app` command system-wide.

2. **Create a New Project**  
   ```bash
   npx set-react-app project-name
   # or if you installed globally:
   set-react-app project-name
   ```

3. **Move into the Newly Created Directory**  
   ```bash
   cd project-name
   ```

4. **Start the Development Server**  
   ```bash
   npm start
   ```
   This will start the Vite dev server on **[http://localhost:3000](http://localhost:3000)** by default.

---

## Available Scripts

Once inside your project directory, you can run:

- **`npm run start`** or **`npm run dev`**  
  Runs the app in development mode using Vite on port **3000**.  

- **`npm run build`**  
  Builds the app for production to the `dist` folder. It bundles React in production mode, optimizes builds for the best performance, and is ready for deployment.  

- **`npm run preview`**  
  Serves the production build from the `dist` folder locally. Helpful for verifying your production build before deploying.  

---

## Project Structure

```bash
.
├── public          # Public assets that are directly served
├── src             # Main source code for the application
│   ├── App.jsx     # Root App component
│   ├── index.jsx    # Entry point for React application
│   └── ...         # Other components and files
├── tests           # Test files (if separated from src)
├── package.json
├── vite.config.js  # Vite configuration
└── ...
```

Feel free to modify this structure based on your project’s needs.

---

## Dependencies

```jsonc
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "web-vitals": "^2.1.4"
},
"devDependencies": {
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/react": "^13.4.0",
  "@testing-library/user-event": "^13.5.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vite": "^4.3.0"
}
```

- **React & React DOM** (18.2.x)  
- **Web Vitals** (2.1.4)  
- **Testing Libraries** (@testing-library suite, jest-dom)  
- **Vite** (4.3.0) and **@vitejs/plugin-react** (4.0.0)  

---

## Contributing

Contributions, suggestions, and feedback are welcome!  
1. Fork the repository  
2. Create a new branch (`git checkout -b feature/some-new-feature`)  
3. Commit changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/some-new-feature`)  
5. Open a Pull Request  

---

## License

This project is **free to use** and distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Connect with Me

**Author:** [Shubham Sarda](https://www.linkedin.com/in/shubhamsarda/) / [@shubham_ul](https://x.com/shubham_ul)  

If you find this project helpful or have any questions, feel free to reach out on LinkedIn/Twitter!

**Happy Coding!**
