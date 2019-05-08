from bs4 import BeautifulSoup
import requests
import re
import json

# Get and extract specific data from the Soaring Forecast------------------------------------------------------------------
soarfcasturl = 'https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt'
soarfcastpagecontent = BeautifulSoup(requests.get(soarfcasturl).text, "html.parser")

# Split page content into individual lines
for line in soarfcastpagecontent:
    soarfcastlines = line.split("\n")

# Extract weekday, month, and 1-2 digit day for report date from line 7
reportwkday = soarfcastlines[7][21:24]
reportmonth = re.search('Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec', soarfcastlines[7]).group()
reportday = re.search('\d{1,2}', soarfcastlines[7]).group()
reportdate = reportwkday + ", " + reportmonth + " " + reportday

# Extract RoL from line 11 for 1-4 digits, format for comma
maxrol = '{:,}'.format(int(re.search('\d{1,4}', soarfcastlines[11]).group()))

# Extract ToL from line 12 for up to 5 digits, format for comma
tol = '{:,}'.format(int(re.search('\d{1,5}', soarfcastlines[12]).group()))

# Extract OD "None" or converted time ('1430' to '2:30 pm')
od = soarfcastlines[16][48:52]
if od != "None":
    od = int(soarfcastlines[16][48:50])
    if od > 11:
        ampm = " pm"
    else:
        ampm = " am"
    if od > 12:
        od = od - 12
    od = str(od) + ":" + soarfcastlines[16][50:52] + ampm

# Extract height of the -3 index for up to 5 digits, format for comma
neg3 = '{:,}'.format(int(re.findall('\d{1,5}', soarfcastlines[19])[1]))

print("Report date: " + reportdate)
print("Max RoL (ft/min): " + maxrol)
print("Top of lift (ft): " + tol)
print("OD: " + od)
print("-3 Index (ft): " + neg3)

soarfcastjson = {}
soarfcastjson['SOARING_FORECAST_DATA'] = []
soarfcastjson['SOARING_FORECAST_DATA'].append({
    'report_date': reportdate
})
soarfcastjson['SOARING_FORECAST_DATA'].append({
    'max_rol': maxrol
})
soarfcastjson['SOARING_FORECAST_DATA'].append({
    'top_of_lift': tol
})
soarfcastjson['SOARING_FORECAST_DATA'].append({
    'od': od
})
soarfcastjson['SOARING_FORECAST_DATA'].append({
    'neg3_index': neg3
})

with open('soarfcastjson.json', 'w') as outfile:
    json.dump(soarfcastjson, outfile)

#python webscraper.py