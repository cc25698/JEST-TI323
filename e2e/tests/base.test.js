
const { Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHORTS_DIR = path.join(__dirname, '..', 'screenshots');

// garante que o. diretorio existe e se nao cria - o 
if (!fs.existsSync(SCREENSHORTS_DIR)) fs.mkdirSync(SCREENSHORTS_DIR, { recursive: true});

async function tiraFoto(name) {
    try {
        const img =  await Driver.takeScreenshot();
        const filePath = path.join(SCREENSHORTS_DIR, `${name}.png`);
        fs.writeFileSync(filePath, img, 'base64');
        console.log(`Fotografia tirada com sucesso ${name}.png`);
    } catch (e) {
        console.warn('Erro ao capturar a vossa fotografia', e)
    }
} 

async function main() {
    try {
        const opcoes = new chrome.Options();
        opcoes.addArguments(
            '--headless=new',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=800, 640',
            '--disable-gpu'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(opcoes)
            .build()
        await driver.manage().setTimeouts({implicit: 5000, pageLoad: 15000});

        await driver.get(BASE_URL + '/login');

        tiraFoto('Pagina_login');

        await driver.findElement(By.id('username')).sendKeys('Adm');
        await driver.findElement(By.id('password')).sendKeys('admin');

        tiraFoto('Dados_preenchidos');

        await driver.findElement(By.id('loginForm')).submit();

        await new Promise(r => setTimeout(r, 800));

        tiraFoto("Pagina_erro");

        const errMsg = await driver.findElement(By.css('.erro')).getText();
        if(!errMsg.includes('inválidos')) throw new Error(`falhou: ${errMsg}`)

    } finally {
        if(driver) await driver.quit();
    }
}

main().catch( err => {
    console.log()
})