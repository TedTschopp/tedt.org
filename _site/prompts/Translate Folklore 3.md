I have a JSON file that contains Swiss Folktales formatted in the [JSON ORIGINAL] section.

Please take a look at the Python program in the [Python that reads the JSON file, calls OpenAI's GPT4o API, and writes the output to a new JSON file in the format shown in the [JSON TRANSLATED] section.


[JSON ORIGINAL] 
[
    {
        "AuthorCategoryLocation": "(Meinrad Lienert, Sage, Ganze Schweiz)",
        "SourceURL": "https://www.maerchenstiftung.ch/de/maerchen/maerchensuche/5170/aus-dem-schwabenkrieg--benedikt-fontana",
        "Title": " Aus dem Schwabenkrieg - Benedikt Fontana",
        "Text": "Einstmals, im Ausgange des fünfzehnten Jahrhunderts, hatten sich die Schweizer mit ihren biedern Nachbarn über dem Rhein und Bodensee überworfen, besonders der guten Stadt Konstanz wegen, die sowohl der Schwäbische Bund als auch die Eidgenossen gerne besessen hätten. Die alte Bischofsstadt wäre erst nicht ungern schweizerisch geworden, aber als die ungestümen Eidgenossen sie einst überfielen und mit Gewalt zu eidgenössischer Minne zwingen wollten, kündigten ihnen die erbosten Konstanzer die Freundschaft und traten dem Schwäbischen Bunde bei. Dies und weitere Ursachen brachten den sogenannten Schwabenkrieg zum Ausbruch. Man stritt hin und her und tat sich beiderseits viel Abbruch und Schaden, wobei jedoch die Schwaben hübsch hinter dem Rhein und Bodensee blieben. Am ärgsten plagte es die Schweizer, wenn die Schwaben ihnen über den Rhein hinüber \"Kuhmäuler\" zuriefen und bei ihrem Anblick zu muhen und zu plärren anfingen.\n\nAls nun auch der Kaiser Maximilian, den man den letzten Ritter nennt, dem Schwäbischen Bund zu Hilfe kam, sah es für die Eidgenossen bös aus. Der Kaiser aber wollte die Schweizer zwingen, die neue Reichsordnung anzunehmen, und dann gedachte er das Graubündnerland und danach auch die Eidgenossen wieder der österreichischen Herrschaft zu unterwerfen. Jetzt brachen die Schweizer eilends mit all ihren Pannern auf, dem Heere des Kaisers entgegenzurücken, denn wenn des Kaisers Heer siegte, mußten sie für ihr Land grausige Zeiten erwarten, da der österreichische Ritter Burkhardt von Randeck, ein grimmiger Schweizerfeind, gesagt hatte: \"Ich will auf den Tag im Schweizerland räuchern und brennen, daß Gott im Regenbogen vor Rauch und Hitze blinzeln und die Füße an sich ziehen muß.\"\n\nAber der Himmel hörte diese lästerliche Rede, und die Strafe folgte ihr auf dem Fuße. Denn als nun des Kaisers Heer über die Berge stieg, um zuerst die Graubündner zu unterwerfen, empfingen ihn diese und ihre Eidgenossen also vortrefflich, daß er nach vielen grimmigen Gefechten und Kämpfen den Krieg verlor und die Schweiz und ihre Bundesgenossen von Graubünden für immer bei ihren Freiheiten belassen mußte.\n\nGanz besonders heiß ging's in diesem Kriege in der Schlacht auf der Malserheide zu. Da gewann sich ein Graubündner namens Benedikt Fontana großen Ruhm. Er führte den Gewalthaufen der Graubündner und ihrer Eidgenossen. Nun versperrte ihnen eine lange Schanze den Vormarsch. Ein Sturm nach dem andern wurde von den tapferen Tirolerschützen, die hinter der Schanze steckten, abgeschlagen. Als nun auch der österreichische Feind im Rücken in hellen Scharen angestürmt kam, mußten die Schweizer fürchten, erdrückt zu werden. Da riß sie ihr Anführer Fontana zu einem letzten wilden Sturmangriff auf die Schanze mit sich fort, und es gelang, die stark bewehrte Mauer zu nehmen. Fontana stand als erster jenseits der Schanze. Aber da traf ihn ein Schwertstich in den Unterleib. Wie gelähmt stutzten seine Kampfgenossen einen Augenblick, da sie ihren Anführer auf die Knie sinken sahen. Aber er erhob sich noch einmal, streckte das Schwert hochauf und rief, mit der einen Hand die gräßliche Wunde am Unterleib zudrückend: \"Eidgenossen, frisch drauf! Kümmert euch nicht um meinen Fall. Ich bin ja nur ein einzelner Mann. Heute könnt ihr als Sieger das Vaterland und eure freien Bünde retten. Werdet ihr aber besiegt, so kommen eure Nachfahren in ewige Knechtschaft!\" Dann sank er tot zusammen. Jetzt sprangen die Eidgenossen, jauchzend vor Wut und Kampfgier, über die Schanze und schlugen den Feind nach blutigem Ringen vollständig.\n\nJenem Lästerer aber, dem Ritter von Randeck, war es sonderbar ergangen. Nämlich etwa einen Monat vorher brach er mit zehntausend Mann von Konstanz auf und überfiel einen Haufen Eidgenossen im Schwaderloch. Sie hatten schlechte Wache gehalten und sich überraschen lassen. Nun mußten sie sich fechtend in den Wald zurückziehen. Jetzt wurde der Randecker so übermütig, daß er vorschlug, man wolle gleich nach Zürich ziehen, ins Herz der Eidgenossenschaft. Die Führer konnten sich aber nicht einigen. Also machten sie ein mächtiges Feuer an und fingen an zu kochen und zu braten und wurden guter Dinge. \"Ei\", sagte aber der wilde Randecker, als er sah, wie alles drüber und drunter ging, \"seht euch vor, die Kühmelker kommen gewiß wieder!\"\n\nUnd sie kamen. Sie hatten sich in den Wald zurückgezogen, wo nach und nach so viele Schweizer zu ihnen stießen, daß ihrer wohl vierzehnhundert zusammengekommen sein mögen. Nun versuchten sie's mit einer Kriegslist. Sie verteilten ihre Trommler im ganzen Wald und ließen sie dann von allen Seiten drauflostrommeln und Wirbel schlagen, daß es einen Mordslärm gab. Entsetzt fuhren die Schwaben in ihrem fröhlichen Lager auf, denn sie meinten, ein gewaltiges eidgenössisches Heer sei im Anzug. Und als nun die Schweizer jauchzend aus dem Walde hervorbrachen, schossen die Krieger vom Schwäbischen Bunde zu hoch. Die Eidgenossen aber fuhren auf sie los, warfen sie auf die Geschütze zurück und auf das entsetzlich rauchende Lagerfeuer, also daß ihrer viele von dem Rauch und der Hitze versengt wurden und erstickten. Und als nun die Eidgenossen nach einem kurzen Hau das Feld behielten und die Toten absuchten, fanden sie auch den wilden Ritter von Randeck mit versengten Haaren und geschwärzt vom Rauch neben den Geschützen am Feuer liegen. Mit Grausen erinnerten sie sich jetzt seiner lästerlichen Rede vor dem Kriege.\n\nQuelle: Meinrad Lienert, Schweizer Sagen und Heldengeschichten, Stuttgart 1915\n\nEingelesen von der Mutabor Märchenstiftung auf www.maerchen.ch.\n",
        "Author": "Meinrad Lienert",
        "Category": " Sage / Diese Kategorie ist nicht im AT-Verzeichnis enthalten."
    },
    {
        "AuthorCategoryLocation": "(Alois Lütolf, Sage, Luzern)",
        "SourceURL": "https://www.maerchenstiftung.ch/de/maerchen/maerchensuche/8354/das-heer-im-schrattenberg",
        "Title": " Das Heer im Schrattenberg",
        "Text": "Das sogeheissene Wetterschiessen nennen sie um Escholzmatt Gurnigeln. Die Leute stellen sich vor, dieses Donnern oder Kanonieren komme vom Gurnigel her, unter welchem Namen sie diesfalls nicht nur den bekannten Berg im Bernbiet verstehen, sondern auch das Schrattengebirge. Wie mal im Herbst ein Hirt seine Herde von der Alp ab dem Schratten trieb, bemerkte er, dass ihm ein Schaf fehle, konnte es aber nicht mehr finden. Sein Erstaunen war nicht gering, als beim Wiederauftrieb ihm das verlorne Schaf so wohlgenährt und froh entgegensprang. Doch wollte es nicht mit der übrigen Herde fressen, man sah, dass ihm diese Weide nicht mehr gut genug sei und es eine bessere kenne. Mein Hirt denkt, er wolle dem Ding schon auf die Spur kommen, verliert das Schaf nicht mehr aus dem Auge, sondern schleicht ihm auf seinen Pfaden nach. Es ging einer Felsenhöhle zu und dann einen langen grossen Gang hindurch in einen unübersehbaren grossen Saal, der ringsum von hellen Kristallen funkelte und wo an prächtigen Bahren die schönsten Streitrosse standen, unzählig viele. Da hatte das Schaf es lang gut genug. Beim Herumgehen kam er an ein hohes stolzes Tor, das bei leichtem Berühren aufsprang und dem überraschten Auge einen zaubervollen Anblick öffnete. Ein anderer Saal, voll Gold und Edelsteinen schimmernd und blitzend weitete seine lichten Räume tief dahin und an herrlichen Tischen sassen und schliefen gar viele schön und wohl gerüstete Kriegsmänner. Zu hinterst, dem Tore gegenüber, ruhte an eigenem Tische der Heerführer. Dieser hob jetzt sein Haupt auf und fragte ernst und würdevoll einen andern Offizier an der Seite: „Wie spät ist es?\" - „Ein Tausend achthundert dreissig!\" gab dieser zur Antwort. „So müssen wir noch 45 Jahre warten\", versetzte der erste und schlief wieder fort. Der Hirt dachte nun auf den Rückzug. Wohl kam ihm der Gedanke, die Unterirdischen könnten von den unermesslichen Schätzen an Gold und Diamanten einige Hände voll leicht entbehren. Aber er beschloss, doch zuerst seinen Seelsorger zu beraten. Den Eingang merkte er sich gut und liess auch das Schaf einstweilen zurück. Hernach kam er wieder dahin, um jetzt so viel möglich von den herrlichen Dingen sich anzueignen. Zu spät, das Loch war nimmer zu finden und das Schaf kam nimmer zum Vorschein.\n\n \n\nQuelle: Alois Lütolf, Sagen, Bräuche, Legenden aus den fünf Orten Luzern, Uri, Schwyz, Unterwalden und Zug, Luzern 1865. Eingelesen von der Mutabor Märchenstiftung, www.maerchen.ch.\n",
        "Author": "Alois Lütolf",
        "Category": " Sage / Diese Kategorie ist nicht im AT-Verzeichnis enthalten."
    }
]

[JSON TRANSLATED] 
[
    {
        "AuthorCategoryLocation": "(Meinrad Lienert, Sage, Ganze Schweiz)",
        "SourceURL": "https://www.maerchenstiftung.ch/de/maerchen/maerchensuche/5170/aus-dem-schwabenkrieg--benedikt-fontana",
        "Title": {
            "Original": " Aus dem Schwabenkrieg - Benedikt Fontana",
            "Translated": "{Insert Translated Title Here}"
        },
        "Text": {
            "Original": "Einstmals, im Ausgange des fünfzehnten Jahrhunderts, hatten sich die Schweizer mit ihren biedern Nachbarn über dem Rhein und Bodensee überworfen, besonders der guten Stadt Konstanz wegen, die sowohl der Schwäbische Bund als auch die Eidgenossen gerne besessen hätten. Die alte Bischofsstadt wäre erst nicht ungern schweizerisch geworden, aber als die ungestümen Eidgenossen sie einst überfielen und mit Gewalt zu eidgenössischer Minne zwingen wollten, kündigten ihnen die erbosten Konstanzer die Freundschaft und traten dem Schwäbischen Bunde bei. Dies und weitere Ursachen brachten den sogenannten Schwabenkrieg zum Ausbruch. Man stritt hin und her und tat sich beiderseits viel Abbruch und Schaden, wobei jedoch die Schwaben hübsch hinter dem Rhein und Bodensee blieben. Am ärgsten plagte es die Schweizer, wenn die Schwaben ihnen über den Rhein hinüber \"Kuhmäuler\" zuriefen und bei ihrem Anblick zu muhen und zu plärren anfingen.\n\nAls nun auch der Kaiser Maximilian, den man den letzten Ritter nennt, dem Schwäbischen Bund zu Hilfe kam, sah es für die Eidgenossen bös aus. Der Kaiser aber wollte die Schweizer zwingen, die neue Reichsordnung anzunehmen, und dann gedachte er das Graubündnerland und danach auch die Eidgenossen wieder der österreichischen Herrschaft zu unterwerfen. Jetzt brachen die Schweizer eilends mit all ihren Pannern auf, dem Heere des Kaisers entgegenzurücken, denn wenn des Kaisers Heer siegte, mußten sie für ihr Land grausige Zeiten erwarten, da der österreichische Ritter Burkhardt von Randeck, ein grimmiger Schweizerfeind, gesagt hatte: \"Ich will auf den Tag im Schweizerland räuchern und brennen, daß Gott im Regenbogen vor Rauch und Hitze blinzeln und die Füße an sich ziehen muß.\"\n\nAber der Himmel hörte diese lästerliche Rede, und die Strafe folgte ihr auf dem Fuße. Denn als nun des Kaisers Heer über die Berge stieg, um zuerst die Graubündner zu unterwerfen, empfingen ihn diese und ihre Eidgenossen also vortrefflich, daß er nach vielen grimmigen Gefechten und Kämpfen den Krieg verlor und die Schweiz und ihre Bundesgenossen von Graubünden für immer bei ihren Freiheiten belassen mußte.\n\nGanz besonders heiß ging's in diesem Kriege in der Schlacht auf der Malserheide zu. Da gewann sich ein Graubündner namens Benedikt Fontana großen Ruhm. Er führte den Gewalthaufen der Graubündner und ihrer Eidgenossen. Nun versperrte ihnen eine lange Schanze den Vormarsch. Ein Sturm nach dem andern wurde von den tapferen Tirolerschützen, die hinter der Schanze steckten, abgeschlagen. Als nun auch der österreichische Feind im Rücken in hellen Scharen angestürmt kam, mußten die Schweizer fürchten, erdrückt zu werden. Da riß sie ihr Anführer Fontana zu einem letzten wilden Sturmangriff auf die Schanze mit sich fort, und es gelang, die stark bewehrte Mauer zu nehmen. Fontana stand als erster jenseits der Schanze. Aber da traf ihn ein Schwertstich in den Unterleib. Wie gelähmt stutzten seine Kampfgenossen einen Augenblick, da sie ihren Anführer auf die Knie sinken sahen. Aber er erhob sich noch einmal, streckte das Schwert hochauf und rief, mit der einen Hand die gräßliche Wunde am Unterleib zudrückend: \"Eidgenossen, frisch drauf! Kümmert euch nicht um meinen Fall. Ich bin ja nur ein einzelner Mann. Heute könnt ihr als Sieger das Vaterland und eure freien Bünde retten. Werdet ihr aber besiegt, so kommen eure Nachfahren in ewige Knechtschaft!\" Dann sank er tot zusammen. Jetzt sprangen die Eidgenossen, jauchzend vor Wut und Kampfgier, über die Schanze und schlugen den Feind nach blutigem Ringen vollständig.\n\nJenem Lästerer aber, dem Ritter von Randeck, war es sonderbar ergangen. Nämlich etwa einen Monat vorher brach er mit zehntausend Mann von Konstanz auf und überfiel einen Haufen Eidgenossen im Schwaderloch. Sie hatten schlechte Wache gehalten und sich überraschen lassen. Nun mußten sie sich fechtend in den Wald zurückziehen. Jetzt wurde der Randecker so übermütig, daß er vorschlug, man wolle gleich nach Zürich ziehen, ins Herz der Eidgenossenschaft. Die Führer konnten sich aber nicht einigen. Also machten sie ein mächtiges Feuer an und fingen an zu kochen und zu braten und wurden guter Dinge. \"Ei\", sagte aber der wilde Randecker, als er sah, wie alles drüber und drunter ging, \"seht euch vor, die Kühmelker kommen gewiß wieder!\"\n\nUnd sie kamen. Sie hatten sich in den Wald zurückgezogen, wo nach und nach so viele Schweizer zu ihnen stießen, daß ihrer wohl vierzehnhundert zusammengekommen sein mögen. Nun versuchten sie's mit einer Kriegslist. Sie verteilten ihre Trommler im ganzen Wald und ließen sie dann von allen Seiten drauflostrommeln und Wirbel schlagen, daß es einen Mordslärm gab. Entsetzt fuhren die Schwaben in ihrem fröhlichen Lager auf, denn sie meinten, ein gewaltiges eidgenössisches Heer sei im Anzug. Und als nun die Schweizer jauchzend aus dem Walde hervorbrachen, schossen die Krieger vom Schwäbischen Bunde zu hoch. Die Eidgenossen aber fuhren auf sie los, warfen sie auf die Geschütze zurück und auf das entsetzlich rauchende Lagerfeuer, also daß ihrer viele von dem Rauch und der Hitze versengt wurden und erstickten. Und als nun die Eidgenossen nach einem kurzen Hau das Feld behielten und die Toten absuchten, fanden sie auch den wilden Ritter von Randeck mit versengten Haaren und geschwärzt vom Rauch neben den Geschützen am Feuer liegen. Mit Grausen erinnerten sie sich jetzt seiner lästerlichen Rede vor dem Kriege.\n\nQuelle: Meinrad Lienert, Schweizer Sagen und Heldengeschichten, Stuttgart 1915\n\nEingelesen von der Mutabor Märchenstiftung auf www.maerchen.ch.\n",
            "Translated": "{Insert Translated Text Here}"
        },        
        "Author": "Meinrad Lienert",
        "Category": " Sage / Diese Kategorie ist nicht im AT-Verzeichnis enthalten."
    }
]


[Python Code]

```Python

import json
import openai
import time
import os

# Set up the OpenAI API key
openai.api_key = "YOUR_OPENAI_API_KEY"

# Function to call OpenAI's GPT-4o API for translation
def translate_text(text):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Translate the following Swiss folktale into English:\n\n{text}",
            max_tokens=2048,
            temperature=0.7
        )
        return response.choices[0].text.strip()
    except openai.error.RateLimitError:
        print("Rate limit exceeded. Waiting for 60 seconds...")
        time.sleep(60)
        return translate_text(text)  # Retry after waiting
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Function to extract named locations using OpenAI
def extract_locations(text):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Extract all named locations from the following Swiss folktale and list them with their English translations:\n\n{text}\n\nFormat the response as a JSON array with each entry having 'Name', 'EnglishTranslation', 'Latitude', and 'Longitude'. If the latitude and longitude are not known, leave them empty.",
            max_tokens=2048,
            temperature=0.7
        )
        return json.loads(response.choices[0].text.strip())
    except openai.error.RateLimitError:
        print("Rate limit exceeded. Waiting for 60 seconds...")
        time.sleep(60)
        return extract_locations(text)  # Retry after waiting
    except Exception as e:
        print(f"An error occurred while extracting locations: {e}")
        return []

# Function to save progress
def save_progress(translated_data, error_entries, translated_filename='progress.json', error_filename='errors.json'):
    with open(translated_filename, 'w', encoding='utf-8') as file:
        json.dump(translated_data, file, ensure_ascii=False, indent=4)
    with open(error_filename, 'w', encoding='utf-8') as file:
        json.dump(error_entries, file, ensure_ascii=False, indent=4)

# Function to load progress
def load_progress(filename='progress.json'):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

# Function to load error entries
def load_errors(filename='errors.json'):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

# Read the original JSON file
with open('swiss_folktales.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Load progress and error entries
translated_data = load_progress()
error_entries = load_errors()

# Ask the user how many entries to process
total_entries = len(data) - len(translated_data)
print(f"There are {total_entries} entries remaining to process.")
num_entries_to_process = int(input("Enter the number of entries to process in this run (0 for all): "))

if num_entries_to_process == 0 or num_entries_to_process > total_entries:
    num_entries_to_process = total_entries

# Start translating from the last saved point
for index, entry in enumerate(data[len(translated_data):len(translated_data) + num_entries_to_process], start=len(translated_data)):
    print(f"Translating entry {index + 1} of {len(data)}")
    
    translated_title = translate_text(entry["Title"])
    translated_text = translate_text(entry["Text"])
    locations = extract_locations(entry["Text"])
    
    if translated_title and translated_text:
        translated_entry = {
            "AuthorCategoryLocation": entry["AuthorCategoryLocation"],
            "SourceURL": entry["SourceURL"],
            "Title": {
                "Original": entry["Title"],
                "Translated": translated_title
            },
            "Text": {
                "Original": entry["Text"],
                "Translated": translated_text
            },
            "Author": entry["Author"],
            "Category": entry["Category"],
            "Specific Locations in the Story": locations
        }
        translated_data.append(translated_entry)
    else:
        print("Error encountered for entry. Logging error.")
        error_entries.append(entry)
    
    # Save progress and error entries after each iteration
    save_progress(translated_data, error_entries)
    
    # Throttle requests to avoid hitting the rate limit
    time.sleep(1)

# Write the final translated JSON to a new file
with open('translated_swiss_folktales.json', 'w', encoding='utf-8') as file:
    json.dump(translated_data, file, ensure_ascii=False, indent=4)

# Clean up the progress file after successful completion
if os.path.exists('progress.json'):
    os.remove('progress.json')

if os.path.exists('errors.json'):
    if not error_entries:
        os.remove('errors.json')
    else:
        print(f"Errors encountered and logged in errors.json")

```