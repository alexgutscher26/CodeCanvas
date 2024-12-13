<h1 align="center">✨ SaaS Code Editor - Next.js 15 ✨</h1>

![Demo App](/public/screenshot-for-readme.png)

## Highlights:

- 🚀 **Tech Stack**: Built with Next.js 15, Convex, Clerk, and TypeScript for a robust and scalable application.
- 💻 **Multi-Language Support**: An online IDE that supports 10 programming languages, catering to diverse coding needs.
- 🎨 **Customizable Themes**: Choose from 5 VSCode themes to personalize your coding environment.
- ✨ **Smart Output Handling**: Efficiently manage output with clear success and error states for better user experience.
- 💎 **Flexible Pricing Plans**: Offers both Free and Pro plans to accommodate different user requirements.
- 🤝 **Community-Driven Sharing**: Engage with a community-driven code sharing system to enhance collaboration.
- 🔍 **Advanced Search Capabilities**: Utilize advanced filtering and search options to quickly find what you need.
- 👤 **User Profiles**: Track execution history with personal profiles for a tailored experience.
- 📊 **Statistics Dashboard**: Gain insights into usage and performance through a comprehensive statistics dashboard.
- ⚙️ **Customizable Font Size**: Adjust font sizes to improve readability and comfort while coding.
- 🔗 **Webhook Integration**: Seamlessly integrate webhooks for enhanced functionality.
- 🌟 **Professional Deployment Walkthrough**: Step-by-step guidance for deploying your applications professionally.

## Installation

To install the required dependencies, use the following command:

```bash
pnpm install
```

## Usage

Here are some examples of how to use the key components in this application:

### Example Component

```tsx
import ExampleComponent from './components/ExampleComponent';

const App = () => {
    return <ExampleComponent />;
};
```

## Contributing

We welcome contributions! Please follow these guidelines when contributing:
- Use TypeScript for all code.
- Ensure your code is well-documented and follows the DRY principle.
- Write tests for new features and bug fixes.

## Error Handling

Make sure to implement comprehensive error handling in your components. Always plan for edge cases to ensure a smooth user experience.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
```

### Add these env to Convex Dashboard

```js
CLERK_WEBHOOK_SECRET=
LEMON_SQUEEZY_WEBHOOK_SECRET=
```

### Run the app

```shell
npm run dev
```
