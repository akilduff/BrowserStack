const webdriver = require('selenium-webdriver');
const assert = require('assert');

async function runTestWithCaps (capabilities) {
  let driver = new webdriver.Builder()
    .usingServer('http://andrewkilduff_Ytnc6z:jMauRf2xtuEUtfgzpzCh@hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
  await driver.get("http://www.google.com");

  const inputField = await driver.findElement(webdriver.By.name("q"));
  await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this submits on desktop browsers
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
  } catch (e) {
    await inputField.submit(); // this helps in mobile browsers
  }

  // First Assertion - Page Title Equality
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    const actualTitle = await driver.getTitle();
    if (await assert.equal(actualTitle, 'BrowserStack - Google Search') === true) {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title is exactly BrowserStack - Google Search"}}'
      );
    } else {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title is NOT exactly BrowserStack - Google Search"}}'
      );
    }
  } catch (e) {
    const actualTitle = await driver.getTitle();
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
    );
  }

  // Second Assertion - Test Link Text Equality
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    const testLinkDesktop = await driver.findElement(webdriver.By.xpath(`//*[@id="rso"]/div[1]/div/div/div/div/div/div/div[1]/a/h3`));
    const linkTextDesktop = await testLinkDesktop.getText(); // What is the text of the Desktop link
    if (await assert.equal(linkTextDesktop, 'BrowserStack: Most Reliable App & Cross Browser Testing Platform...') === true) {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Desktop Link Text matches expected Google Results for BrowserStack"}}'
      );
    } else {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Desktop Link Text does NOT match expected Google Results for BrowserStack"}}'
      );
    }
  } catch (e) {
    try {
      await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
      const testLinkMobile = await driver.findElement(webdriver.By.xpath(`//*[@id="rso"]/div[1]/div/div[1]/div/div[1]/a/div[2]/div`));
      const linkTextMobile = await testLinkMobile.getText(); // What is the text of the Mobile link
      if (await assert.equal(testLinkMobile, 'BrowserStack') === true)
      await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Mobile Link Text matches expected Google Results for BrowserStack"}}'
      );
    } catch (e) {
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Link Text does NOT match expected Google Results for BrowserStack"}}'
      );
    }
  }

  // Third Assertion - Navigation to First Link on Desktop & Page Title Equality
  try {
    await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    const testLink = await driver.findElement(webdriver.By.xpath(`//*[@id="rso"]/div[1]/div/div/div/div/div/div/div[1]/a/h3`));
    await testLink.click(); // Click on the link
    await driver.wait(webdriver.until.titleMatches(/Most/i), 5000);
    const linkTitle = await driver.getTitle();
    console.log(linkTitle)
      if (await assert.equal(linkTitle, `Most Reliable App & Cross Browser Testing Platform | BrowserStack`) === true) {
        await driver.executeScript(
          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Link Title matches BrowserStack homepage"}}'
        );
      } else {
        await driver.executeScript(
          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Link Title does NOT match BrowserStack homepage"}}'
        );
      }
  } catch (e) {
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "No link to click"}}'
    );
  }
  await driver.quit();
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
  'browserName': 'Chrome',
  'browser_version': '91',
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
