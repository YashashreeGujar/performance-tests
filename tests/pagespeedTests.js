import axios from 'axios';
import chai, { expect } from 'chai';
import testURLs from './testData.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Performance Metrics Tests with PageSpeed Insights', function () {

    this.timeout(100000); // Increase the default timeout for API call

    const apiKey = process.env.PAGE_SPEED_API_KEY;

    let performanceData;

    before(async () => {
        try {
            const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${testURLs[0]}&key=${apiKey}`);
            performanceData = response.data.lighthouseResult.audits;
        } catch (error) {
            console.error(`Error fetching performance data:`, error);
            // Handle the error, e.g., set performanceData to a default value or fail the suite.
        }
    });

    testURLs.forEach(testURL => {
        describe(`Testing URL: ${testURL}`, function () {

            // First Contentful Paint (FCP) metric
            it('Should have a good First Contentful Paint (FCP) metric', async () => {
                const fcpValue = performanceData['first-contentful-paint'].numericValue;
                const expectedThreshold = 1800;

                // Check if the FCP metric meets the threshold
                expect(fcpValue, `FCP metric for ${testURL} is expected to be less than ${expectedThreshold} milliseconds.`).to.be.lessThan(expectedThreshold);
            });

            // Largest Contentful Paint (LCP) metric
            it('Should have a good Largest Contentful Paint (LCP) metric', async () => {
                const lcpValue = performanceData['largest-contentful-paint'].numericValue;
                const expectedThreshold = 2500;

                // Check if the LCP metric meets the threshold
                expect(lcpValue, `LCP metric for ${testURL} is expected to be less than ${expectedThreshold} milliseconds.`).to.be.lessThan(expectedThreshold);
            });

            // Cumulative Layout Shift (CLS) metric
            it('Should have a good Cumulative Layout Shift (CLS) metric', async () => {
                const clsValue = performanceData['cumulative-layout-shift'].numericValue;
                const expectedThreshold = 0.1;

                // Check if the CLS metric meets the threshold
                expect(clsValue, `CLS metric for ${testURL} is expected to be less than or equal to ${expectedThreshold}`).to.be.lessThanOrEqual(expectedThreshold);
            });

            it('Should have a good Total Blocking Time (TBT) metric as a proxy for FID', async () => {
                const tbtValue = performanceData['total-blocking-time'].numericValue;
                const expectedThreshold = 200;

                // Check if the TBT metric meets the threshold
                expect(tbtValue, `TBT metric for ${testURL} is expected to be less than ${expectedThreshold} ms`).to.be.lessThan(expectedThreshold);
            });

            it('Should have a good First Input Delay (FID) metric', async () => {
                const fidValue = performanceData['max-potential-fid'].numericValue;
                const expectedThreshold = 100;

                // Check if the FID metric meets the threshold
                expect(fidValue, `FID metric: ${fidValue} ms, expected to be less than ${expectedThreshold} ms`).to.be.lessThan(expectedThreshold);
            });

            it('Should have a good Interaction to Next Paint (INP) metric', async () => {
                const inpValue = performanceData['interactive'].numericValue;
                const expectedThreshold = 200;

                // Check if the INP metric meets the threshold
                expect(inpValue, `INP metric for ${testURL} is expected to be less than or equal to ${expectedThreshold} ms`).to.be.lessThanOrEqual(expectedThreshold);
            });

        });
    });
});
