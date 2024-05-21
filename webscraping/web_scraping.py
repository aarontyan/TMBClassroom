import requests
from bs4 import BeautifulSoup as bs
import pandas as pd
import lxml

data = []

def scrapeSection(section_soup):
    if not section_soup:
        return
    
    def process(category):
        return section_soup.find(category).text if section_soup.find(category) and section_soup.find(category).text != "" else "N/A"

    if section_soup.find("startDate") is None or section_soup.find("endDate") is None:
        return
    
    subject_id = section_soup.find("subject").get("id")
    course = process("startDate")
    course_id = section_soup.find("course").get("id")
    section_number = process("sectionNumber")
    start_date = section_soup.find("startDate").text
    end_date = section_soup.find("endDate").text
    meetings = section_soup.find_all("meeting")
    for meeting in meetings:
        if meeting.find("start") is None or meeting.find("end") is None or meeting.find("daysOfTheWeek") is None:
            continue
        class_type = meeting.find("type").text
        start_time = meeting.find("start").text
        end_time = meeting.find("end").text
        days = meeting.find("daysOfTheWeek").text
        room = meeting.find("roomNumber").text if meeting.find("roomNumber") and meeting.find("roomNumber").text != "" else "N/A"
        building = meeting.find("buildingName").text if meeting.find("buildingName") and meeting.find("buildingName").text != "" else "N/A"
        instructor_tag = section_soup.find_all("instructors")
        instructors = []
        for instructor in instructor_tag:
            instructors.append(instructor.text.strip())
        data.append(
            {
                "Subject": subject_id.strip(),
                "Course Id": course_id.strip(),
                "Name": course.strip(),
                "Section Code": section_number.strip(),
                "Start Date": start_date.strip(),
                "End Date": end_date.strip(),
                "Type": class_type.strip(),
                "Start": start_time.strip(),
                "End": end_time.strip(),
                "Days": days.strip(),
                "Room Number": room.strip(),
                "Building": building.strip(),
                "Instructors": instructors,
            }
        )
     
def scrapeCourse(course_soup):
    if not course_soup:
        return
    sections = course_soup.find_all("section")
    for section in sections:
        section_url = section.get("href")
        if "cis.local/cisapi" in section_url:
                url_split = section_url.split("/")
                section_url = f"https://courses.illinois.edu/cisapp/explorer/schedule/2024/fall/{url_split[-3]}/{url_split[-2]}/{url_split[-1]}.xml"
        section_response = requests.get(section_url)
        if section_response.status_code < 200 or section_response.status_code > 205:
            raise Exception("Non 200 status code")
        section_data = section_response.content
        section_soup = bs(section_data, features="xml")
        scrapeSection(section_soup)


def scrapeSubject(subject_soup):
    if not subject_soup:
        return
    courses = subject_soup.find_all("course")
    for course in courses:
        course_url = course.get("href")
        if "cis.local/cisapi" in course_url:
                url_split = course_url.split("/")
                course_url = f"https://courses.illinois.edu/cisapp/explorer/schedule/2024/fall/{url_split[-2]}/{url_split[-1]}.xml"
        course_response = requests.get(course_url)
        if course_response.status_code < 200 or course_response.status_code > 205:
            raise Exception("Non 200 status code")
        course_data = course_response.content
        course_soup = bs(course_data, features="xml")
        scrapeCourse(course_soup)


def scrapeMain():
    url = "http://courses.illinois.edu/cisapp/explorer/schedule/2024/fall.xml"
    response = requests.get(url)
    main_data = response.content
    soup = bs(main_data, features="xml")
    subjects = soup.find_all("subject")
    for subject in subjects:
        subject_url = subject.get("href")
        subject_response = requests.get(subject_url)
        if subject_response.status_code < 200 or subject_response.status_code > 205:
            raise Exception("Non 200 status code")
        subject_data = subject_response.content
        subject_soup = bs(subject_data, features="xml")
        scrapeSubject(subject_soup)

scrapeMain()
df = pd.DataFrame(data)
df.to_csv("uiuc_fa2024_courses.csv", index=False)

