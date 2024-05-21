from bs4 import BeautifulSoup as bs
import requests as rq
from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd


data = []
def scrapeCourse(course_soup):
    course_code = course_soup.find(class_ = "app-inline").text.strip()
    course_name = course_soup.find(class_ = "app-label app-text-engage").text.strip()

    sections = course_soup.find_all("tr", attrs={"role":"row"})[1:]
    for section in sections:
        info = section.find_all("td")
        data.append({
            "Course Code" : course_code, 
            "Course Name" : course_name,
            "CRN": info[3].text.strip(),
            "Type":  info[4].text.strip(),
            "Section": info[5].text.strip(),
            "Time": info[6].text.strip(),
            "Day": info[7].text.strip(),
            "Location": info[8].text.strip(),
            "Instructor" : info[9].text.strip() if info[9] else "n.a"
        })

def scrapeSubject(subject_soup):
    classes = subject_soup.find_all('tr')[1:]
    for curr in classes:
        course_a = curr.find('a')
        if course_a:
            class_url = "https://courses.illinois.edu" + course_a.get('href')
            driver.get(class_url)
            course_data = driver.page_source
            course_soup = bs(course_data, "html.parser")
            scrapeCourse(course_soup)

def scrapeMain():
    url = "https://courses.illinois.edu/schedule/2024/fall"
    response = rq.get(url)
    data = response.text
    soup = bs(data, "html.parser")
    subjects = soup.find_all('tr')[1:]
    for subject in subjects:
        a = subject.find('a')
        if a:
            subject_url = "https://courses.illinois.edu" + a.get('href')
            subject_response = rq.get(subject_url)
            subject_data = subject_response.text
            subject_soup = bs(subject_data, "html.parser")
            scrapeSubject(subject_soup)

def cleanTable():
    df = pd.read_csv("./uiuc_fa2024_courses.csv")

    df = df[(df["Location"] != "n.a.") & (df["Location"] != "Location Pending")]
    df[['Room Number', 'Building']] = df['Location'].str.extract(r'(\d+)\s+(.*)', expand=True)
    df.drop(columns=['Location'], inplace=True)
    df['Time'] = df['Time'].str.replace(r'^\d{4}', '', regex=True)
    df.to_csv("uiuc_fa2024_courses_formatted.csv", index = False)

driver = webdriver.Chrome()
scrapeMain()
driver.quit()

df = pd.DataFrame(data)
df.to_csv("uiuc_fa2024_courses.csv", index = False)

cleanTable()


