 
# /html//div[@id='root']//div[@class='layout-content']//div[@class='posts-feed']/div[1]//div[@class='post-header']
# /html//div[@id='root']//div[@class='layout-content']/div/div[2]/div//textarea[@placeholder='Write a comment...']
# /html//div[@id='root']//div[@class='layout-content']/div/div[2]/div//textarea[@placeholder='Write a comment...'] 
# //*[@id="root"]/div[1]/div/div/div/div[1]/div/div/div[2]

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


URL_STRONY = "http://localhost:5173/"

XPATH_COMMENT_INPUT = "/html//div[@id='root']//div[@class='layout-content']/div/div[2]/div//textarea[@placeholder='Write a comment...']"

XPATH_SUBMIT_BUTTON = '//*[@id="root"]/div[1]/div/div/div[2]/div/div[2]/div[2]/div[1]/button'

LICZBA_KOMENTARZY = 2
TRESC_KOMENTARZA = "komm number =  "

DELAY = 0

wait = WebDriverWait(webdriver, 20)

options = Options()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 20)

try:
    driver.get(URL_STRONY)

    login_input = wait.until(
        EC.presence_of_element_located((By.ID, "login"))
    )
    login_input.clear()
    login_input.send_keys("admin")

    password_input = wait.until(
        EC.presence_of_element_located((By.ID, "password"))
    )
    password_input.clear()
    password_input.send_keys("password")

    login_button = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            'button.auth-button[type="submit"]'
        ))
    )
    login_button.click()


    close_tutorial_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            '//*[@id="root"]/div[2]/div/div[1]/button'
        ))
    )
    close_tutorial_button.click()



    element = wait.until(EC.presence_of_element_located((By.XPATH,'//*[@id="root"]/div[1]/div/div/div/div[1]/div/div/div[2]')))
    element.click()

    for i in range(LICZBA_KOMENTARZY):
        comment_input = wait.until(
            EC.element_to_be_clickable((By.XPATH, XPATH_COMMENT_INPUT))
        )

        comment_input.clear()
        comment_input.send_keys(f"{TRESC_KOMENTARZA} #{i+1}")

        submit_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, XPATH_SUBMIT_BUTTON))
        )
        submit_button.click()

        print(f"Dodano komentarz {i+1}/{LICZBA_KOMENTARZY}")

        time.sleep(DELAY)
    
finally:
    driver.quit()  
    pass