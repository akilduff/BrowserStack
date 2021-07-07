const webdriver = require('selenium-webdriver');
async function runTestWithCaps(capabilities) {
  let driver;
  try {
    driver = new webdriver.Builder().
      usingServer('http://andrewkilduff_Ytnc6z:jMauRf2xtuEUtfgzpzCh@hub-cloud.browserstack.com/wd/hub').
      withCapabilities(capabilities).build();
    await driver.get('http://www.google.com');
    const inputField = await driver.findElement(webdriver.By.name("q"));
    await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this works on desktop browsers
    try {
      await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    } catch (e) {
      await inputField.submit(); // this takes care of submit in mobile browsers
    }
    const title = await driver.getTitle();
    console.log(title);
    // Setting the status of test as 'passed' or 'failed' based on the condition; if title of the web page included 'BrowserStack'
    if(title.match(/BrowserStack/i)) {
      await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains BrowserStack!"}}');
    } else {
      await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain BrowserStack!"}}');
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
const capabilities1 = {
  'browserName': 'firefox',
  'browser_version': 'latest',
  'os': 'Windows',
  'os_version': '10',
  'build': 'browserstack-build-1',
  'name': 'Parallel test 1'
}
const capabilities2 = {
  'device': 'Google Pixel 5',
  'browserName': 'Android',
  'os_version': '11.0',
  'real_mobile': 'true',
  'build': 'browserstack-build-1',
  'name': 'Parallel test 2'
}
const capabilities3 = {
	'device': 'iPhone 12 Pro',
  'browserName': 'iPhone',
  'os_version': '14',
  'real_mobile': 'true',
  'build': 'browserstack-build-1',
  'name': 'Parallel test 3'
}
const capabilities4 = {
  'browserName': 'ie',
  'browser_version': '11',
  'os': 'Windows',
  'os_version': '10',
  'build': 'browserstack-build-1',
  'name': 'Parallel test 4'
}
const capabilities5 = {
  'browserName': 'safari',
  'browser_version': '14',
  'os': 'OS X',
  'os_version': 'Big Sur',
  'build': 'browserstack-build-1',
  'name': 'Parallel test 5'
}
runTestWithCaps(capabilities1);
runTestWithCaps(capabilities2);
runTestWithCaps(capabilities3);
runTestWithCaps(capabilities4);
runTestWithCaps(capabilities5);