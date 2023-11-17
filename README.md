# Performance Tests

This project includes tests for performance metrics using the PageSpeed Insights API.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) (Node Package Manager) installed


### Installing

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/YashashreeGujar/performance-tests.git
2. Navigate to the project directory:
    cd performance-metrics-tests
3. Install dependencies:
    npm install


### Setting Up API Keys
This project uses environment variables to handle sensitive information such as API keys. eam members can obtain their API key, like a link to the PageSpeed Insights API documentation.  

Follow these steps to set up your own API keys:
1. Create a file named .env in the root of the project.
2. Get your API key from PageSpeed Insights API.
3. Add your API key to the .env file in the following format:
    PAGE_SPEED_API_KEY=your_api_key_here
    Replace your_api_key_here with your actual API key.
4. Important: Add .env to your .gitignore file to ensure it is not committed to the repository.

### Running Tests
Once you have set up your API keys, you can run tests using the following command:
npm test

### Environment Variables
PAGE_SPEED_API_KEY: Your API key for the PageSpeed API.

### Reporting
This project uses Mochawesome for test reporting. After running tests, you can find the HTML report in the mochawesome-report directory.

### Additional Notes
Ensure your API keys are kept secure and are not shared publicly.
Each team member should use their own API key for testing to comply with API provider terms and security best practices.