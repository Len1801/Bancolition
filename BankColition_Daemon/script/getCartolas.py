import os
import requests
from lxml import etree
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def getCartola(url, username, password, xPath, folderpath):
    
    response = requests.get(url)
    parser = etree.HTMLParser()
    tree = etree.fromstring(response.text, parser)

    for row in tree.xpath('/html/body'):
        links = row.xpath(xPath)
        if links:
            link = links[0]
            relative_url = link.attrib.get('href')
            if relative_url.find('\\') != -1: relative_url = relative_url.replace('\\', '/').replace('\\', '/')
            
            if url[-1] == '/': url = url[:-1]
            
            absolute_url = str(url+'/'+relative_url)            
            filename = os.path.basename(relative_url)
            
            headers = {
                'referer': url,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
                'accept': 'application/json'
            }
            response = requests.get(absolute_url, headers=headers)

            if response.status_code == 200:
                open(folderpath+'/'+filename, "wb").write(response.content)
            else:
                getSelenium(url, folderpath, xPath)
            
            filepath = folderpath+'/'+filename

            return filepath
  
def getSelenium(url, folderpath, xPath):
            
    path_loc = os.path.realpath(folderpath)
    options = webdriver.ChromeOptions()
    options.headless = True
    prefs = {"download.default_directory" : path_loc}
    options.add_experimental_option("prefs",prefs)
    options.add_experimental_option("excludeSwitches",["ignore-certificate-errors"])
    
    driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)
    driver.get(url)
    sleep(1)
    
    downloadFile = driver.find_element(By.XPATH, xPath) 
    downloadFile.click()
    sleep(1)
    driver.close()
    
