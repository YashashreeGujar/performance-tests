import axios from 'axios';
import * as chai from 'chai';
const expect = chai.expect;
import testURLs from './testData.js';
import dotenv from 'dotenv';
dotenv.config();
// Constants for expected values
const FCP_THRESHOLD = 1800;
const LCP_THRESHOLD = 2500;
const CLS_THRESHOLD = 0.1;
const TBT_THRESHOLD = 200;
const FID_THRESHOLD = 100;
const INP_THRESHOLD = 200;

// Function to check actual values against expected values
function checkPerformanceMetric(metricName, actualValue, expectedThreshold, url, diagnostics) {
    let errorMessage = `${metricName} metric for ${url} is ${actualValue}. Expected: less than or equal to ${expectedThreshold}.`;
    const diagnosticsInfo = diagnostics?.details?.items[0]
    if (diagnosticsInfo) {
        errorMessage += ` Diagnostic Info: ${JSON.stringify(diagnosticsInfo)}`;
    } else {
        errorMessage += ` No diagnostic information available.`;
    }
    expect(actualValue, errorMessage).to.be.lessThanOrEqual(expectedThreshold);
    if (actualValue > expectedThreshold) {
        console.error(`Test failed: ${errorMessage}`);
    }
}


describe('Performance Metrics Tests with PageSpeed Insights API ', function () {
    this.timeout(100000); 
    const apiKey = process.env.PAGE_SPEED_API_KEY;
    testURLs.forEach(testURL => {
        describe(`Testing URL: ${testURL}`, function () {
            let performanceData;
            before(async () => {
                try {
                    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${testURL}&key=${apiKey}`);
                    performanceData = response.data.lighthouseResult.audits;
                } catch (error) {
                    console.error(`Error fetching performance data for ${testURL}:`, error);
                    throw new Error(`Failed to fetch performance data for ${testURL}`);
                }
            });
            
            it('Should have a good First Contentful Paint (FCP) metric', async () => {
                const fcpValue = performanceData['first-contentful-paint'].numericValue;
                checkPerformanceMetric('FCP', fcpValue, FCP_THRESHOLD, testURL, performanceData.diagnostics);
            });
            it('Should have a good Largest Contentful Paint (LCP) metric', async () => {
                const lcpValue = performanceData['largest-contentful-paint'].numericValue;
                checkPerformanceMetric('LCP', lcpValue, LCP_THRESHOLD, testURL, performanceData.diagnostics);
            });
            it('Should have a good Cumulative Layout Shift (CLS) metric', async () => {
                const clsValue = performanceData['cumulative-layout-shift'].numericValue;
                checkPerformanceMetric('CLS', clsValue, CLS_THRESHOLD, testURL, performanceData.diagnostics);
            });
            it('Should have a good Total Blocking Time (TBT) metric as a proxy for FID', async () => {
                const tbtValue = performanceData['total-blocking-time'].numericValue;
                checkPerformanceMetric('TBT', tbtValue, TBT_THRESHOLD, testURL, performanceData.diagnostics);
            });
            it('Should have a good First Input Delay (FID) metric', async () => {
                const fidValue = performanceData['max-potential-fid'].numericValue;
                checkPerformanceMetric('FID', fidValue, FID_THRESHOLD, testURL, performanceData.diagnostics);
            });
            it('Should have a good Interaction to Next Paint (INP) metric', async () => {
                const inpValue = performanceData['interactive'].numericValue;
                checkPerformanceMetric('INP', inpValue, INP_THRESHOLD, testURL, performanceData.diagnostics);
            });
        });
    });
});
