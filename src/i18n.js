import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localforage from 'localforage';

const localForageDetector = {
  type: 'languageDetector',
  async: true, 
  
  detect: async (callback) => {
    try {
      const savedLang = await localforage.getItem('user_language');
      if (savedLang) {
        callback(savedLang);
        return;
      }
      
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'pl', 'ua'].includes(browserLang)) {
        callback(browserLang);
      } else {
        callback('pl');
      }
    } catch (error) {
      console.error('Ошибка чтения языка из IndexedDB', error);
      callback('pl');
    }
  },
  
  init: () => {},
  
  cacheUserLanguage: async (lng) => {
    try {
      await localforage.setItem('user_language', lng);
    } catch (error) {
      console.error('Ошибка сохранения языка в IndexedDB', error);
    }
  }
};

i18n
  .use(localForageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "greeting": {
            "morning_done": "Morning workout done! 🔥",
            "great_pace": "Great pace today! ⚡",
            "great_job": "Great job today! 🌙",
            "morning_ready": "Ready for a morning workout? 🌅",
            "afternoon_time": "Time for an afternoon activity! ⚡",
            "start_now": "Start your activity now! 🌙",
            "training_done": "Training completed this day! 🔥",
            "rest_day": "Recovery day? 🌱",
            "planning_new": "Planning a new workout? 🎯"
          },
          "cycle": {
            "phase_menstrual": "Menstrual phase",
            "phase_follicular": "Follicular phase",
            "phase_ovulation": "Ovulation",
            "phase_luteal": "Luteal phase",
            "energy_low": "Low",
            "energy_high": "High",
            "energy_max": "Maximum",
            "energy_falling": "Falling",
            "menstrual_advice": "Let your body rest. Choose light Yoga, Stretching or a short walk.",
            "menstrual_nutrition": "Eat foods rich in iron, healthy fats and dark chocolate.",
            "follicular_advice": "Energy is rising! Great time for Cardio, running and new challenges.",
            "follicular_nutrition": "Choose light, fresh meals, salads, lean protein and fermented foods.",
            "ovulation_advice": "You are at your peak! Best time for heavy Gym and breaking records.",
            "ovulation_nutrition": "Eat cruciferous vegetables (e.g. broccoli) to help estrogen metabolism.",
            "luteal_advice": "Slow down in the second half of the phase. Choose Pilates or moderate training.",
            "luteal_nutrition": "Reach for complex carbohydrates (sweet potatoes, quinoa) to prevent sugar drops.",
            "title": "Menstrual cycle",
            "no_data": "No data. Mark the start day below.",
            "period_started": "Period started",
            "today_lower": "today",
            "this_day": "on this day",
            "period_prefix": "Period",
            "day_singular": "day",
            "days_plural": "days",
            "next_in": "Next in",
            "cycle_day_full": "Cycle day {{day}}",
            "energy_level": "Energy level",
            "workout_goal": "Workout (Goal: {{goal}} min)",
            "nutrition": "Nutrition"
          },
          "home": {
            "greeting_name": "Hi, {{name}}!",
            "greeting_default": "Hi!",
            "selected_week": "Selected Week",
            "calendar_btn": "Calendar",
            "day": "Day",
            "daily_goal": "Daily Goal",
            "completed": "Completed",
            "streak": "Streak",
            "days_in_a_row": "Days in a row",
            "activities_title": "Activities",
            "no_activities": "No activities",
            "add_first_workout": "Add first workout",
            "time": "Time",
            "distance": "Distance",
            "intensity": "Intensity",
            "mood": "Mood",
            "close": "Close",
            "today": "Today",
            "streak_hint": "Train 2 days in a row to ignite the fire!"
          },
          "activities": {
            "Bieganie": "Running",
            "Trening siłowy": "Strength training",
            "Jazda na rowerze": "Cycling",
            "Joga": "Yoga",
            "Spacer": "Walking",
            "Pływanie": "Swimming",
            "Kardio": "Cardio",
            "Trekking": "Trekking",
            "Sporty walki": "Martial arts",
            "Rolki": "Rollerblading",
            "Rozciąganie": "Stretching",
            "Inne": "Other"
          },
          "days": {
            "mon": "Mon", "tue": "Tue", "wed": "Wed", "thu": "Thu", "fri": "Fri", "sat": "Sat", "sun": "Sun"
          },
          "months": {
            "jan": "January", "feb": "February", "mar": "March", "apr": "April", "may": "May", "jun": "June",
            "jul": "July", "aug": "August", "sep": "September", "oct": "October", "nov": "November", "dec": "December"
          },
          "add_activity": {
            "tab_gps": "GPS",
            "tab_manual": "Manual",
            "heading_what": "What did you train today?",
            "subheading_select": "Select activity from the list below",
            "alert_duration": "Enter workout time!",
            "alert_intensity": "Select intensity!",
            "alert_mood": "Select mood!",
            "custom_name_placeholder": "Workout name...",
            "add_prefix": "Add",
            "time": "Time",
            "minutes": "Minutes",
            "distance": "Distance",
            "kilometers": "Kilometers",
            "intensity": "Intensity",
            "intensity_low": "Low",
            "intensity_medium": "Medium",
            "intensity_high": "High",
            "mood": "Mood",
            "date": "Date",
            "select_date": "Select date",
            "change": "Change",
            "save_workout": "Save workout",
            "history_title": "Your history",
            "history_empty": "No saved activities.",
            "history_do_first": "Do your first workout!",
            "today": "Today"
          },
          "activities_labels": {
            "running": "Running",
            "gym": "Gym",
            "cycling": "Cycling",
            "yoga": "Yoga",
            "walking": "Walking",
            "swimming": "Swimming",
            "cardio": "Cardio",
            "trekking": "Trekking",
            "martial_arts": "Martial arts",
            "rollerblading": "Rollerblading",
            "stretching": "Stretching",
            "other": "Other"
          },
          "months_short": {
            "jan": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr", "may": "May", "jun": "Jun",
            "jul": "Jul", "aug": "Aug", "sep": "Sep", "oct": "Oct", "nov": "Nov", "dec": "Dec"
          },
          "stats_page": {
            "title": "Statistics",
            "filters": {
              "week": "Week",
              "month": "Month",
              "all": "All"
            },
            "charts": {
              "duration": "Duration",
              "no_data": "No data",
              "activity_types": "Activity Types",
              "sum": "Total",
              "calories": "Burned calories"
            },
            "bmi": {
              "title": "BMI Index",
              "weight": "Weight",
              "height": "Height",
              "underweight": "Underweight",
              "normal": "Normal",
              "overweight": "Overweight",
              "obese": "Obese",
              "no_data": "Enter weight and height in settings"
            },
            "heatmap": {
              "title": "Activity Map (Last 28 days)"
            },
            "records": {
              "title": "Personal Records",
              "longest_workout": "Longest workout",
              "best_distance": "Best distance",
              "favorite_sport": "Favorite sport",
              "none": "None"
            },
            "insight": {
              "title": "Your Insight",
              "best_mood": "Your best mood (🤩/🙂) usually comes after workouts with",
              "no_mood": "Rate your mood after a workout to unlock wellbeing analysis! 🧠",
              "intensity_low": "LOW",
              "intensity_medium": "MEDIUM",
              "intensity_high": "HIGH"
            },
            "summary": {
              "title": "Summary",
              "avg_time": "Average time",
              "total_distance": "Total distance",
              "activity_count": "Number of activities",
              "calories": "Calories burned",
              "most_active_day": "Most active day",
              "trend_more": "{{count}} more than last week",
              "trend_less": "{{count}} less than last week",
              "trend_same": "Same as last week"
            },
            "modal": {
              "workout_x_of_y": "Workout {{current}} of {{total}}",
              "time": "Time",
              "intensity": "Intensity",
              "distance": "Distance",
              "mood": "Mood",
              "close": "Close"
            }
          },
          "goals_page": {
            "main_title": "Goals and Achievements",
            "your_profile": "Your Profile",
            "ranks_system_title": "Rank System",
            "trophy_wall": "Your Trophy Wall",
            "ranks": {
              "novice": "Novice",
              "beginner": "Beginner",
              "adept": "Fitness Adept",
              "enthusiast": "Enthusiast",
              "veteran": "Veteran",
              "master": "Master",
              "champion": "Champion",
              "legend": "Legend"
            },
            "challenge": {
              "days_left_one": "{{count}} day left",
              "days_left_other": "{{count}} days left",
              "progress": "Progress",
              "unit_km": "km",
              "unit_workouts": "w.outs"
            },
            "challenges": {
              "c1": { "title": "Weekly Sprint", "desc": "Cover 20 km in 7 days." },
              "c2": { "title": "Iron Discipline", "desc": "Complete 5 workouts in 5 days." },
              "c3": { "title": "Power Marathon", "desc": "Cover 50 km in 14 days." },
              "c4": { "title": "Active Start", "desc": "Complete 7 workouts in 10 days." },
              "c5": { "title": "Long Distance", "desc": "Cover 100 km in 30 days." },
              "c6": { "title": "Calorie Monster", "desc": "Burn 3000 kcal in 7 days." },
              "c7": { "title": "Fiery Week", "desc": "Burn 5000 kcal in 10 days." }
            }
          },
          "badge_system": {
            "badges": {
              "starter_title": "Starter", "starter_desc": "Complete your first activity!",
              "poczatkujacy_title": "Beginner", "poczatkujacy_desc": "Complete 5 workouts in total!",
              "amator_title": "Amateur", "amator_desc": "Complete 10 workouts in total!",
              "weteran_title": "Veteran", "weteran_desc": "Complete 50 workouts! Amazing!",
              "stowka_title": "Centurion!", "stowka_desc": "100 workouts. You are a legend!",
              "regularny_title": "Regular", "regularny_desc": "Train 3 days in a row!",
              "maszyna_title": "Machine", "maszyna_desc": "Train 7 days in a row without a break!",
              "tytan_title": "Titan", "tytan_desc": "A month (30 days) of training in a row!",
              "spacerowicz_title": "Walker", "spacerowicz_desc": "Cover a total distance of 10 km!",
              "maratonczyk_title": "Marathoner", "maratonczyk_desc": "Cover a total distance of 42 km!",
              "podroznik_title": "Traveler", "podroznik_desc": "Cover a total distance of 100 km!",
              "aktywista_title": "Activist", "aktywista_desc": "Complete 25 workouts!",
              "elita_title": "Elite", "elita_desc": "Complete 200 workouts!",
              "cyborg_title": "Cyborg", "cyborg_desc": "Half a thousand (500) workouts!",
              "zdeterminowany_title": "Determined", "zdeterminowany_desc": "Two weeks (14 days) in a row!",
              "fanatyk_title": "Fanatic", "fanatyk_desc": "60 days of training without a break!",
              "niepowstrzymany_title": "Unstoppable", "niepowstrzymany_desc": "100 days in a row! Machine!",
              "weteran_roku_title": "Year on the Run", "weteran_roku_desc": "365 days in a row! Absolute record!",
              "biegacz_title": "Runner", "biegacz_desc": "Cover a total of 25 km!",
              "ultramaratonczyk_title": "Ultra", "ultramaratonczyk_desc": "Cover a total of 200 km!",
              "wedrowiec_title": "Wanderer", "wedrowiec_desc": "Cover a total of 500 km!",
              "zdobywca_title": "Conqueror", "zdobywca_desc": "Cover a total of 1000 km!",
              "kosmonauta_title": "Cosmonaut", "kosmonauta_desc": "2000 km! You are in space!",
              "plomyk_title": "Spark", "plomyk_desc": "Burn your first 1,000 kcal.",
              "ognisko_title": "Campfire", "ognisko_desc": "Burn a total of 2,500 kcal.",
              "pochodnia_title": "Torch", "pochodnia_desc": "Burn a total of 5,000 kcal.",
              "spalacz_title": "Fat Burner", "spalacz_desc": "Burn 20,000 kcal in total. It's getting hot!",
              "wulkan_title": "Volcano", "wulkan_desc": "Burn 100,000 kcal! A true force of nature!",
              "supernowa_title": "Supernova", "supernowa_desc": "Burn 1,000 kcal in a single workout!",
              "event_sprint_title": "Lightning", "event_sprint_desc": "Weekly Sprint completed!",
              "event_zelazna_title": "Iron Will", "event_zelazna_desc": "Iron Discipline completed!",
              "event_maraton_title": "Titan of Power", "event_maraton_desc": "Power Marathon completed!",
              "event_start_title": "Spark", "event_start_desc": "Active Start completed!",
              "event_dystans_title": "Cosmic Dust", "event_dystans_desc": "Long Distance completed!",
              "event_potwor_title": "Beast", "event_potwor_desc": "Completed the Calorie Monster challenge!",
              "event_ognisty_title": "Inferno", "event_ognisty_desc": "Completed the Fiery Week challenge!"
            },
            "ui": {
              "gold_trophy": "Gold Trophy",
              "active_event": "Active Event",
              "unlocked": "Unlocked",
              "almost": "Almost!",
              "new_achievement": "New Achievement",
              "goal": "Goal: {{desc}}",
              "progress": "Progress",
              "loading": "Loading...",
              "share": "Share",
              "close": "Close",
              "understand": "Got it",
              "locked": "Locked",
              "legendary_trophy": "Legendary Trophy",
              "all_trophies": "All Trophies",
              "collection": "Your achievement collection",
              "filter_all": "All",
              "filter_achieved": "Unlocked",
              "filter_locked": "In progress",
              "discover_more": "Discover More",
              "more_trophies": "+{{count}} Trophies",
              "share_error": "Failed to generate image 😔",
              "share_default_title": "My achievement!",
              "share_gold_title": "Gold Trophy!",
              "share_gold_text": "I earned a special Gold Trophy: {{title}}! 🏆\n\nTry to beat me! Join the challenge in our app:\n👉 {{url}}",
              "share_default_text": "Another goal reached: {{title}}! 🔥\n\nGet fit with me. Download the app and start training:\n👉 {{url}}"
            }
          },
          "tracker": {
            "geolocation_not_supported": "Geolocation is not supported",
            "error": "Error: ",
            "activity": "Activity",
            "live": "LIVE",
            "offline": "OFFLINE",
            "distance": "Distance",
            "speed": "Speed",
            "ready_to_start": "Ready to start?",
            "waiting_for_gps": "Waiting for GPS",
            "stop_workout": "Stop Workout",
            "start_workout": "Start Workout",
            "summary": "Summary",
            "rate_workout": "Rate your workout",
            "distance_short": "Distance",
            "time_short": "Time",
            "intensity": "Intensity",
            "mood": "Mood",
            "save_workout": "Save workout",
            "default_name": "GPS Workout"
          },
          "goal_tracker": {
            "status_exceeded": "🌟 Goal Exceeded!",
            "status_completed": "🎯 Goal Achieved!",
            "status_keep_going": "💪 Keep it up!",
            "weekly_goal_title": "Weekly Goal",
            "complete_prefix": "Complete",
            "complete_suffix": "workouts this week.",
            "streak_days": "🔥 {{count}} days in a row",
            "of_goal": "of {{goal}}",
            "daily_calories_title": "Daily Calorie Goal",
            "burned_today": "Burned today",
            "status_cal_completed": "🎯 Daily goal reached!",
            "status_cal_exceeded": "🔥 Pure Fire!",
            "status_cal_keep_going": "⚡ Keep burning!"
          },
          "activity_details": {
            "burned": "Burned"
          }
        }
      },
      pl: {
        translation: {
          "greeting": {
            "morning_done": "Poranny trening zaliczony! 🔥",
            "great_pace": "Świetne tempo dzisiaj! ⚡",
            "great_job": "Świetna robota dzisiaj! 🌙",
            "morning_ready": "Gotowy na poranny trening? 🌅",
            "afternoon_time": "Czas na popołudniową aktywność! ⚡",
            "start_now": "Zacznij swoją aktywność już teraz! 🌙",
            "training_done": "Trening zaliczony w tym dniu! 🔥",
            "rest_day": "Dzień regeneracji? 🌱",
            "planning_new": "Planujesz nowy trening? 🎯"
          },
          "cycle": {
            "phase_menstrual": "Faza menstruacyjna",
            "phase_follicular": "Faza folikularna",
            "phase_ovulation": "Owulacja",
            "phase_luteal": "Faza lutealna",
            "energy_low": "Niski",
            "energy_high": "Wysoki",
            "energy_max": "Maksymalny",
            "energy_falling": "Spadający",
            "menstrual_advice": "Daj ciału odpocząć. Wybierz lekką Jogę, Rozciąganie lub krótki spacer.",
            "menstrual_nutrition": "Jedz pokarmy bogate w żelazo, zdrowe tłuszcze i gorzką czekoladę.",
            "follicular_advice": "Energia rośnie! Świetny czas na Kardio, bieganie i nowe wyzwania.",
            "follicular_nutrition": "Wybieraj lekkie, świeże posiłki, sałatki, chude białko i fermentowane jedzenie.",
            "ovulation_advice": "Jesteś na szczycie! Najlepszy czas na ciężką Siłownię i bicie rekordów.",
            "ovulation_nutrition": "Jedz warzywa krzyżowe (np. brokuły), aby pomóc w metabolizmie estrogenów.",
            "luteal_advice": "Zwolnij tempo w drugiej połowie fazy. Wybierz Pilates lub umiarkowany trening.",
            "luteal_nutrition": "Sięgaj po złożone węglowodany (bataty, komosa), by zapobiec spadkom cukru.",
            "title": "Cykl menstruacyjny",
            "no_data": "Brak danych. Zaznacz dzień startu poniżej.",
            "period_started": "Miesiączka zaczęła się",
            "today_lower": "dzisiaj",
            "this_day": "w tym dniu",
            "period_prefix": "Miesiączka",
            "day_singular": "dzień",
            "days_plural": "dni",
            "next_in": "Następna za",
            "cycle_day_full": "Dzień {{day}} cyklu",
            "energy_level": "Poziom energii",
            "workout_goal": "Trening (Cel: {{goal}} min)",
            "nutrition": "Odżywianie"
          },
          "home": {
            "greeting_name": "Cześć, {{name}}!",
            "greeting_default": "Cześć!",
            "selected_week": "Wybrany Tydzień",
            "calendar_btn": "Kalendarz",
            "day": "Dzień",
            "daily_goal": "Cel Dnia",
            "completed": "Zrealizowano",
            "streak": "Seria",
            "days_in_a_row": "Dni z rzędu",
            "activities_title": "Aktywności",
            "no_activities": "Brak aktywności",
            "add_first_workout": "Dodaj pierwszy trening",
            "time": "Czas",
            "distance": "Dystans",
            "intensity": "Intensywność",
            "mood": "Nastrój",
            "close": "Zamknij",
            "today": "Dzisiaj",
            "streak_hint": "Trenuj 2 dni z rzędu, by odpalić ogień!"
          },
          "activities": {
            "Bieganie": "Bieganie",
            "Trening siłowy": "Trening siłowy",
            "Jazda na rowerze": "Jazda na rowerze",
            "Joga": "Joga",
            "Spacer": "Spacer",
            "Pływanie": "Pływanie",
            "Kardio": "Kardio",
            "Trekking": "Trekking",
            "Sporty walki": "Sporty walki",
            "Rolki": "Rolki",
            "Rozciąganie": "Rozciąganie",
            "Inne": "Inne"
          },
          "days": {
            "mon": "Pn", "tue": "Wt", "wed": "Śr", "thu": "Cz", "fri": "Pt", "sat": "Sb", "sun": "Nd"
          },
          "months": {
            "jan": "Styczeń", "feb": "Luty", "mar": "Marzec", "apr": "Kwiecień", "may": "Maj", "jun": "Czerwiec",
            "jul": "Lipiec", "aug": "Sierpień", "sep": "Wrzesień", "oct": "Październik", "nov": "Listopad", "dec": "Grudzień"
          },
          "add_activity": {
            "tab_gps": "GPS",
            "tab_manual": "Ręcznie",
            "heading_what": "Co dzisiaj trenowałeś?",
            "subheading_select": "Wybierz aktywność z listy poniżej",
            "alert_duration": "Wpisz czas treningu!",
            "alert_intensity": "Wybierz intensywność!",
            "alert_mood": "Wybierz samopoczucie!",
            "custom_name_placeholder": "Nazwa treningu...",
            "add_prefix": "Dodaj",
            "time": "Czas",
            "minutes": "Minut",
            "distance": "Dystans",
            "kilometers": "Kilometrów",
            "intensity": "Intensywność",
            "intensity_low": "Niska",
            "intensity_medium": "Średnia",
            "intensity_high": "Wysoka",
            "mood": "Samopoczucie",
            "date": "Data",
            "select_date": "Wybierz datę",
            "change": "Zmień",
            "save_workout": "Zapisz trening",
            "history_title": "Twoja historia",
            "history_empty": "Brak zapisanych aktywności.",
            "history_do_first": "Zrób swój pierwszy trening!",
            "today": "Dzisiaj"
          },
          "activities_labels": {
            "running": "Bieganie",
            "gym": "Siłownia",
            "cycling": "Rower",
            "yoga": "Joga",
            "walking": "Spacer",
            "swimming": "Pływanie",
            "cardio": "Kardio",
            "trekking": "Trekking",
            "martial_arts": "Sztuki walki",
            "rollerblading": "Rolki",
            "stretching": "Rozciąganie",
            "other": "Inne"
          },
          "months_short": {
            "jan": "Sty", "feb": "Lut", "mar": "Mar", "apr": "Kwi", "may": "Maj", "jun": "Cze",
            "jul": "Lip", "aug": "Sie", "sep": "Wrz", "oct": "Paź", "nov": "Lis", "dec": "Gru"
          },
          "stats_page": {
            "title": "Statystyki",
            "filters": {
              "week": "Tydzień",
              "month": "Miesiąc",
              "all": "Wszystko"
            },
            "charts": {
              "duration": "Czas trwania",
              "no_data": "Brak danych",
              "activity_types": "Typy aktywności",
              "sum": "Suma",
              "calories": "Spalone kalorie"
            },
            "bmi": {
              "title": "Wskaźnik BMI",
              "weight": "Waga",
              "height": "Wzrost",
              "underweight": "Niedowaga",
              "normal": "W normie",
              "overweight": "Nadwaga",
              "obese": "Otyłość",
              "no_data": "Wprowadź wagę i wzrost w ustawieniach"
            },
            "heatmap": {
              "title": "Mapa Aktywności (Ostatnie 28 dni)"
            },
            "records": {
              "title": "Osobiste Rekordy",
              "longest_workout": "Najdłuższy trening",
              "best_distance": "Najlepszy dystans",
              "favorite_sport": "Ulubiony sport",
              "none": "Brak"
            },
            "insight": {
              "title": "Twój Insight",
              "best_mood": "Najlepszy nastrój (🤩/🙂) masz zazwyczaj po treningach o",
              "no_mood": "Dodawaj ocenę nastroju po treningu, aby odblokować analizę samopoczucia! 🧠",
              "intensity_low": "NISKIEJ",
              "intensity_medium": "ŚREDNIEJ",
              "intensity_high": "WYSOKIEJ"
            },
            "summary": {
              "title": "Podsumowanie",
              "avg_time": "Średni czas",
              "total_distance": "Łączny dystans",
              "activity_count": "Liczba aktywności",
              "calories": "Spalone kalorie",
              "most_active_day": "Najbardziej aktywny dzień",
              "trend_more": "{{count}} więcej niż tyg. temu",
              "trend_less": "{{count}} mniej niż tyg. temu",
              "trend_same": "Tyle samo co tyg. temu"
            },
            "modal": {
              "workout_x_of_y": "Trening {{current}} z {{total}}",
              "time": "Czas",
              "intensity": "Intensywność",
              "distance": "Dystans",
              "mood": "Nastrój",
              "close": "Zamknij"
            }
          },
          "goals_page": {
            "main_title": "Cele i osiągnięcia",
            "your_profile": "Twój profil",
            "ranks_system_title": "System Rangi",
            "trophy_wall": "Twoja ściana trofeów",
            "ranks": {
              "novice": "Nowicjusz",
              "beginner": "Początkujący",
              "adept": "Adept Fitnessu",
              "enthusiast": "Entuzjasta",
              "veteran": "Weteran",
              "master": "Mistrz",
              "champion": "Czempion",
              "legend": "Legenda"
            },
            "challenge": {
              "days_left_one": "Został {{count}} dzień",
              "days_left_few": "Zostały {{count}} dni",
              "days_left_many": "Zostało {{count}} dni",
              "days_left_other": "Zostało {{count}} dni",
              "progress": "Postęp",
              "unit_km": "km",
              "unit_workouts": "tren."
            },
            "challenges": {
              "c1": { "title": "Tygodniowy Sprint", "desc": "Pokonaj 20 km w ciągu 7 dni." },
              "c2": { "title": "Żelazna Dyscyplina", "desc": "Wykonaj 5 treningów w 5 dni." },
              "c3": { "title": "Maraton Mocy", "desc": "Pokonaj 50 km w ciągu 14 dni." },
              "c4": { "title": "Aktywny Start", "desc": "Wykonaj 7 treningów w 10 dni." },
              "c5": { "title": "Długi Dystans", "desc": "Pokonaj 100 km w 30 dni." },
              "c6": { "title": "Potwór Kalorii", "desc": "Spal 3000 kcal w 7 dni." },
              "c7": { "title": "Ognisty Tydzień", "desc": "Spal 5000 kcal w 10 dni." }
            }
          },
          "badge_system": {
            "badges": {
              "starter_title": "Starter", "starter_desc": "Ukończ swoją pierwszą aktywność!",
              "poczatkujacy_title": "Początkujący", "poczatkujacy_desc": "Zrób 5 treningów łącznie!",
              "amator_title": "Amator", "amator_desc": "Zrób 10 treningów łącznie!",
              "weteran_title": "Weteran", "weteran_desc": "Zrób 50 treningów! Niesamowite!",
              "stowka_title": "Setka!", "stowka_desc": "100 treningów. Jesteś legendą!",
              "regularny_title": "Regularny", "regularny_desc": "Trenuj 3 dni z rzędu!",
              "maszyna_title": "Maszyna", "maszyna_desc": "Trenuj 7 dni z rzędu bez przerwy!",
              "tytan_title": "Tytan", "tytan_desc": "Miesiąc (30 dni) treningów z rzędu!",
              "spacerowicz_title": "Spacerowicz", "spacerowicz_desc": "Pokonaj łącznie 10 km dystansu!",
              "maratonczyk_title": "Maratończyk", "maratonczyk_desc": "Pokonaj łącznie 42 km dystansu!",
              "podroznik_title": "Podróżnik", "podroznik_desc": "Pokonaj łącznie 100 km dystansu!",
              "aktywista_title": "Aktywista", "aktywista_desc": "Ukończ 25 treningów!",
              "elita_title": "Elita", "elita_desc": "Ukończ 200 treningów!",
              "cyborg_title": "Cyborg", "cyborg_desc": "Pół tysiąca (500) treningów!",
              "zdeterminowany_title": "Zdeterminowany", "zdeterminowany_desc": "Dwa tygodnie (14 dni) z rzędu!",
              "fanatyk_title": "Fanatyk", "fanatyk_desc": "60 dni treningów bez przerwy!",
              "niepowstrzymany_title": "Niepowstrzymany", "niepowstrzymany_desc": "100 dni z rzędu! Maszyna!",
              "weteran_roku_title": "Rok w Biegu", "weteran_roku_desc": "365 dni z rzędu! Absolutny rekord!",
              "biegacz_title": "Biegacz", "biegacz_desc": "Pokonaj łącznie 25 km!",
              "ultramaratonczyk_title": "Ultra", "ultramaratonczyk_desc": "Pokonaj łącznie 200 km!",
              "wedrowiec_title": "Wędrowiec", "wedrowiec_desc": "Pokonaj łącznie 500 km!",
              "zdobywca_title": "Zdobywca", "zdobywca_desc": "Pokonaj łącznie 1000 km!",
              "kosmonauta_title": "Kosmonauta", "kosmonauta_desc": "2000 km! Jesteś w kosmosie!",
              "plomyk_title": "Płomyk", "plomyk_desc": "Spal pierwsze 1,000 kcal.",
              "ognisko_title": "Ognisko", "ognisko_desc": "Spal łącznie 2,500 kcal.",
              "pochodnia_title": "Pochodnia", "pochodnia_desc": "Spal łącznie 5,000 kcal.",
              "spalacz_title": "Spalacz", "spalacz_desc": "Spal łącznie 20,000 kcal. Ale gorąco!",
              "wulkan_title": "Wulkan", "wulkan_desc": "Spal 100,000 kcal! Prawdziwy żywioł!",
              "supernowa_title": "Supernowa", "supernowa_desc": "Spal 1,000 kcal podczas jednego treningu!",
              "event_sprint_title": "Błyskawica", "event_sprint_desc": "Ukończono Tygodniowy Sprint!",
              "event_zelazna_title": "Żelazny Hart", "event_zelazna_desc": "Ukończono Żelazną Dyscyplinę!",
              "event_maraton_title": "Tytan Mocy", "event_maraton_desc": "Ukończono Maraton Mocy!",
              "event_start_title": "Iskra", "event_start_desc": "Ukończono Aktywny Start!",
              "event_dystans_title": "Kosmiczny Pył", "event_dystans_desc": "Ukończono Długi Dystans!",
              "event_potwor_title": "Bestia", "event_potwor_desc": "Ukończono Wyzwanie Potwór Kalorii!",
              "event_ognisty_title": "Piekło", "event_ognisty_desc": "Ukończono Ognisty Tydzień!"
            },
            "ui": {
              "gold_trophy": "Złote Trofeum",
              "active_event": "Wydarzenie Aktywne",
              "unlocked": "Odblokowano",
              "almost": "Prawie!",
              "new_achievement": "Nowe Osiągnięcie",
              "goal": "Cel: {{desc}}",
              "progress": "Postęp",
              "loading": "Ładowanie...",
              "share": "Udostępnij",
              "close": "Zamknij",
              "understand": "Rozumiem",
              "locked": "Zablokowane",
              "legendary_trophy": "Legendarne Trofeum",
              "all_trophies": "Wszystkie Trofea",
              "collection": "Twoja kolekcja osiągnięć",
              "filter_all": "Wszystkie",
              "filter_achieved": "Odblokowane",
              "filter_locked": "W toku",
              "discover_more": "Odkryj Więcej",
              "more_trophies": "+{{count}} Trofeów",
              "share_error": "Nie udało się wygenerować obrazka 😔",
              "share_default_title": "Moje osiągnięcie!",
              "share_gold_title": "Złote Trofeum!",
              "share_gold_text": "Zdobyłem specjalne Złote Trofeum: {{title}}! 🏆\n\nSpróbuj mnie przebić! Dołącz do wyzwania w naszej aplikacji:\n👉 {{url}}",
              "share_default_text": "Kolejny cel osiągnięty: {{title}}! 🔥\n\nZbuduj formę razem ze mną. Pobierz aplikację i zacznij swój trening:\n👉 {{url}}"
            }
          },
          "tracker": {
            "geolocation_not_supported": "Geolokalizacja nie jest wspierana",
            "error": "Błąd: ",
            "activity": "Aktywność",
            "live": "LIVE",
            "offline": "OFFLINE",
            "distance": "Odległość",
            "speed": "Prędkość",
            "ready_to_start": "Gotowy do startu?",
            "waiting_for_gps": "Oczekiwanie na GPS",
            "stop_workout": "Zatrzymaj Trening",
            "start_workout": "Rozpocznij Trening",
            "summary": "Podsumowanie",
            "rate_workout": "Oceń swój trening",
            "distance_short": "Dystans",
            "time_short": "Czas",
            "intensity": "Intensywność",
            "mood": "Samopoczucie",
            "save_workout": "Zapisz trening",
            "default_name": "GPS Trening"
          },
          "goal_tracker": {
            "status_exceeded": "🌟 Cel Przekroczony!",
            "status_completed": "🎯 Cel Osiągnięty!",
            "status_keep_going": "💪 Trzymaj tak dalej!",
            "weekly_goal_title": "Cel tygodniowy",
            "complete_prefix": "Ukończ",
            "complete_suffix": "treningów w tym tygodniu.",
            "streak_days": "🔥 {{count}} dni z rzędu",
            "of_goal": "z {{goal}}",
            "daily_calories_title": "Dzienny Cel Kalorii",
            "burned_today": "Spalono dzisiaj",
            "status_cal_completed": "🎯 Cel dnia zdobyty!",
            "status_cal_exceeded": "🔥 Prawdziwy Ogień!",
            "status_cal_keep_going": "⚡ Spalaj dalej!"
          },
          "activity_details": {
            "burned": "Spalono"
          }
        }
      },
      ua: {
        translation: {
          "greeting": {
            "morning_done": "Ранкове тренування виконано! 🔥",
            "great_pace": "Чудовий темп сьогодні! ⚡",
            "great_job": "Чудова робота сьогодні! 🌙",
            "morning_ready": "Готові до ранкового тренування? 🌅",
            "afternoon_time": "Час для денної активності! ⚡",
            "start_now": "Почніть свою активність зараз! 🌙",
            "training_done": "Тренування виконано в цей день! 🔥",
            "rest_day": "День відновлення? 🌱",
            "planning_new": "Плануєте нове тренування? 🎯"
          },
          "cycle": {
            "phase_menstrual": "Менструальна фаза",
            "phase_follicular": "Фолікулярна фаза",
            "phase_ovulation": "Овуляція",
            "phase_luteal": "Лютеїнова фаза",
            "energy_low": "Низький",
            "energy_high": "Високий",
            "energy_max": "Максимальний",
            "energy_falling": "Спадаючий",
            "menstrual_advice": "Дайте тілу відпочити. Оберіть легку йогу, розтяжку або коротку прогулянку.",
            "menstrual_nutrition": "Їжте продукти, багаті залізом, корисними жирами та темний шоколад.",
            "follicular_advice": "Енергія зростає! Чудовий час для кардіо, бігу та нових викликів.",
            "follicular_nutrition": "Обирайте легкі, свіжі страви, салати, нежирний білок та ферментовану їжу.",
            "ovulation_advice": "Ви на піку! Найкращий час для важкого тренажерного залу та нових рекордів.",
            "ovulation_nutrition": "Їжте хрестоцвіті овочі (напр. броколі), щоб допомогти метаболізму естрогенів.",
            "luteal_advice": "Зменште темп у другій половині фази. Оберіть пілатес або помірні тренування.",
            "luteal_nutrition": "Обирайте складні вуглеводи (батат, кіноа), щоб запобігти падінню цукру.",
            "title": "Менструальний цикл",
            "no_data": "Немає даних. Позначте день початку нижче.",
            "period_started": "Менструація почалася",
            "today_lower": "сьогодні",
            "this_day": "в цей день",
            "period_prefix": "Менструація",
            "day_singular": "день",
            "days_plural": "днів",
            "next_in": "Наступна через",
            "cycle_day_full": "День {{day}} циклу",
            "energy_level": "Рівень енергії",
            "workout_goal": "Тренування (Ціль: {{goal}} хв)",
            "nutrition": "Харчування"
          },
          "home": {
            "greeting_name": "Привіт, {{name}}!",
            "greeting_default": "Привіт!",
            "selected_week": "Обраний тиждень",
            "calendar_btn": "Календар",
            "day": "День",
            "daily_goal": "Ціль дня",
            "completed": "Виконано",
            "streak": "Серія",
            "days_in_a_row": "Днів поспіль",
            "activities_title": "Активності",
            "no_activities": "Немає активностей",
            "add_first_workout": "Додати перше тренування",
            "time": "Час",
            "distance": "Дистанція",
            "intensity": "Інтенсивність",
            "mood": "Настрій",
            "close": "Закрити",
            "today": "Сьогодні",
            "streak_hint": "Тренуйся 2 дні поспіль, щоб запалити вогонь!"
          },
          "activities": {
            "Bieganie": "Біг",
            "Trening siłowy": "Силове тренування",
            "Jazda na rowerze": "Їзда на велосипеді",
            "Joga": "Йога",
            "Spacer": "Прогулянка",
            "Pływanie": "Плавання",
            "Kardio": "Кардіо",
            "Trekking": "Трекінг",
            "Sporty walki": "Бойові мистецтва",
            "Rolki": "Ролики",
            "Rozciąganie": "Розтяжка",
            "Inne": "Інше"
          },
          "days": {
            "mon": "Пн", "tue": "Вт", "wed": "Ср", "thu": "Чт", "fri": "Пт", "sat": "Сб", "sun": "Нд"
          },
          "months": {
            "jan": "Січень", "feb": "Лютий", "mar": "Березень", "apr": "Квітень", "may": "Травень", "jun": "Червень",
            "jul": "Липень", "aug": "Серпень", "sep": "Вересень", "oct": "Жовтень", "nov": "Листопад", "dec": "Грудень"
          },
          "add_activity": {
            "tab_gps": "GPS",
            "tab_manual": "Вручну",
            "heading_what": "Що ви сьогодні тренували?",
            "subheading_select": "Оберіть активність зі списку нижче",
            "alert_duration": "Введіть час тренування!",
            "alert_intensity": "Оберіть інтенсивність!",
            "alert_mood": "Оберіть настрій!",
            "custom_name_placeholder": "Назва тренування...",
            "add_prefix": "Додати",
            "time": "Час",
            "minutes": "Хвилин",
            "distance": "Дистанція",
            "kilometers": "Кілометрів",
            "intensity": "Інтенсивність",
            "intensity_low": "Низька",
            "intensity_medium": "Середня",
            "intensity_high": "Висока",
            "mood": "Настрій",
            "date": "Дата",
            "select_date": "Оберіть дату",
            "change": "Змінити",
            "save_workout": "Зберегти тренування",
            "history_title": "Ваша історія",
            "history_empty": "Немає збережених активностей.",
            "history_do_first": "Зробіть своє перше тренування!",
            "today": "Сьогодні"
          },
          "activities_labels": {
            "running": "Біг",
            "gym": "Тренажерний зал",
            "cycling": "Велосипед",
            "yoga": "Йога",
            "walking": "Прогулянка",
            "swimming": "Плавання",
            "cardio": "Кардіо",
            "trekking": "Трекінг",
            "martial_arts": "Бойові мистецтва",
            "rollerblading": "Ролики",
            "stretching": "Розтяжка",
            "other": "Інше"
          },
          "months_short": {
            "jan": "Січ", "feb": "Лют", "mar": "Бер", "apr": "Кві", "may": "Тра", "jun": "Чер",
            "jul": "Лип", "aug": "Сер", "sep": "Вер", "oct": "Жов", "nov": "Лис", "dec": "Гру"
          },
          "stats_page": {
            "title": "Статистика",
            "filters": {
              "week": "Тиждень",
              "month": "Місяць",
              "all": "Всі"
            },
            "charts": {
              "duration": "Тривалість",
              "no_data": "Немає даних",
              "activity_types": "Типи активностей",
              "sum": "Разом",
              "calories": "Спалені калорії"
            },
            "bmi": {
              "title": "Індекс маси тіла (BMI)",
              "weight": "Вага",
              "height": "Зріст",
              "underweight": "Недостатня вага",
              "normal": "У нормі",
              "overweight": "Надмірна вага",
              "obese": "Ожиріння",
              "no_data": "Введіть вагу та зріст у налаштуваннях"
            },
            "heatmap": {
              "title": "Карта активності (Останні 28 днів)"
            },
            "records": {
              "title": "Особисті рекорди",
              "longest_workout": "Найдовше тренування",
              "best_distance": "Найкраща дистанція",
              "favorite_sport": "Улюблений спорт",
              "none": "Немає"
            },
            "insight": {
              "title": "Ваш інсайт",
              "best_mood": "Найкращий настрій (🤩/🙂) зазвичай буває після тренувань з",
              "no_mood": "Оцініть свій настрій після тренування, щоб розблокувати аналіз самопочуття! 🧠",
              "intensity_low": "НИЗЬКОЮ",
              "intensity_medium": "СЕРЕДНЬОЮ",
              "intensity_high": "ВИСОКОЮ"
            },
            "summary": {
              "title": "Підсумок",
              "avg_time": "Середній час",
              "total_distance": "Загальна дистанція",
              "activity_count": "Кількість активностей",
              "calories": "Спалені калорії",
              "most_active_day": "Найактивніший день",
              "trend_more": "на {{count}} більше, ніж минулого тижня",
              "trend_less": "на {{count}} менше, ніж минулого тижня",
              "trend_same": "Так само, як минулого тижня"
            },
            "modal": {
              "workout_x_of_y": "Тренування {{current}} з {{total}}",
              "time": "Час",
              "intensity": "Інтенсивність",
              "distance": "Дистанція",
              "mood": "Настрій",
              "close": "Закрити"
            }
          },
          "goals_page": {
            "main_title": "Цілі та досягнення",
            "your_profile": "Ваш профіль",
            "ranks_system_title": "Система рангів",
            "trophy_wall": "Ваша стіна трофеїв",
            "ranks": {
              "novice": "Новачок",
              "beginner": "Початківець",
              "adept": "Адепт фітнесу",
              "enthusiast": "Ентузіаст",
              "veteran": "Ветеран",
              "master": "Майстер",
              "champion": "Чемпіон",
              "legend": "Легенда"
            },
            "challenge": {
              "days_left_one": "Залишився {{count}} день",
              "days_left_few": "Залишилося {{count}} дні",
              "days_left_many": "Залишилось {{count}} днів",
              "days_left_other": "Залишилось {{count}} днів",
              "progress": "Прогрес",
              "unit_km": "км",
              "unit_workouts": "трен."
            },
            "challenges": {
              "c1": { "title": "Тижневий спринт", "desc": "Подолайте 20 км за 7 днів." },
              "c2": { "title": "Залізна дисципліна", "desc": "Виконайте 5 тренувань за 5 днів." },
              "c3": { "title": "Марафон сили", "desc": "Подолайте 50 км за 14 днів." },
              "c4": { "title": "Активний старт", "desc": "Виконайте 7 тренувань за 10 днів." },
              "c5": { "title": "Довга дистанція", "desc": "Подолайте 100 км за 30 днів." },
              "c6": { "title": "Монстр Калорій", "desc": "Спаліть 3000 ккал за 7 днів." },
              "c7": { "title": "Вогняний Тиждень", "desc": "Спаліть 5000 ккал за 10 днів." }
            }
          },
          "badge_system": {
            "badges": {
              "starter_title": "Початківець", "starter_desc": "Завершіть своє перше тренування!",
              "poczatkujacy_title": "Новачок", "poczatkujacy_desc": "Зробіть 5 тренувань загалом!",
              "amator_title": "Аматор", "amator_desc": "Зробіть 10 тренувань загалом!",
              "weteran_title": "Ветеран", "weteran_desc": "Зробіть 50 тренувань! Дивовижно!",
              "stowka_title": "Сотня!", "stowka_desc": "100 тренувань. Ви легенда!",
              "regularny_title": "Регулярний", "regularny_desc": "Тренуйтеся 3 дні поспіль!",
              "maszyna_title": "Машина", "maszyna_desc": "Тренуйтеся 7 днів поспіль без перерви!",
              "tytan_title": "Титан", "tytan_desc": "Місяць (30 днів) тренувань поспіль!",
              "spacerowicz_title": "Пішохід", "spacerowicz_desc": "Подолайте загалом 10 км!",
              "maratonczyk_title": "Марафонець", "maratonczyk_desc": "Подолайте загалом 42 км!",
              "podroznik_title": "Мандрівник", "podroznik_desc": "Подолайте загалом 100 км!",
              "aktywista_title": "Активіст", "aktywista_desc": "Завершіть 25 тренувань!",
              "elita_title": "Еліта", "elita_desc": "Завершіть 200 тренувань!",
              "cyborg_title": "Кіборг", "cyborg_desc": "Півтисячі (500) тренувань!",
              "zdeterminowany_title": "Цілеспрямований", "zdeterminowany_desc": "Два тижні (14 днів) поспіль!",
              "fanatyk_title": "Фанатик", "fanatyk_desc": "60 днів тренувань без перерви!",
              "niepowstrzymany_title": "Нестримний", "niepowstrzymany_desc": "100 днів поспіль! Машина!",
              "weteran_roku_title": "Рік у русі", "weteran_roku_desc": "365 днів поспіль! Абсолютний рекорд!",
              "biegacz_title": "Бігун", "biegacz_desc": "Подолайте загалом 25 км!",
              "ultramaratonczyk_title": "Ультра", "ultramaratonczyk_desc": "Подолайте загалом 200 км!",
              "wedrowiec_title": "Блукач", "wedrowiec_desc": "Подолайте загалом 500 км!",
              "zdobywca_title": "Завойовник", "zdobywca_desc": "Подолайте загалом 1000 км!",
              "kosmonauta_title": "Космонавт", "kosmonauta_desc": "2000 км! Ви в космосі!",
              "plomyk_title": "Вогник", "plomyk_desc": "Спаліть перші 1,000 ккал.",
              "ognisko_title": "Багаття", "ognisko_desc": "Спаліть загалом 2,500 ккал.",
              "pochodnia_title": "Смолоскип", "pochodnia_desc": "Спаліть загалом 5,000 ккал.",
              "spalacz_title": "Жироспалювач", "spalacz_desc": "Спаліть 20,000 ккал. Стає гаряче!",
              "wulkan_title": "Вулкан", "wulkan_desc": "Спаліть 100,000 ккал! Справжня стихія!",
              "supernowa_title": "Наднова", "supernowa_desc": "Спаліть 1,000 ккал за одне тренування!",
              "event_sprint_title": "Блискавка", "event_sprint_desc": "Тижневий спринт завершено!",
              "event_zelazna_title": "Залізна воля", "event_zelazna_desc": "Залізну дисципліну завершено!",
              "event_maraton_title": "Титан сили", "event_maraton_desc": "Марафон сили завершено!",
              "event_start_title": "Іскра", "event_start_desc": "Активний старт завершено!",
              "event_dystans_title": "Космічний пил", "event_dystans_desc": "Довгу дистанцію завершено!",
              "event_potwor_title": "Звір", "event_potwor_desc": "Виконано виклик Монстр Калорій!",
              "event_ognisty_title": "Пекло", "event_ognisty_desc": "Виконано Вогняний Тиждень!"
            },
            "ui": {
              "gold_trophy": "Золотий трофей",
              "active_event": "Активна подія",
              "unlocked": "Розблоковано",
              "almost": "Майже!",
              "new_achievement": "Нове досягнення",
              "goal": "Ціль: {{desc}}",
              "progress": "Прогрес",
              "loading": "Завантаження...",
              "share": "Поділитися",
              "close": "Закрити",
              "understand": "Зрозуміло",
              "locked": "Заблоковано",
              "legendary_trophy": "Легендарний трофей",
              "all_trophies": "Всі трофеї",
              "collection": "Ваша колекція досягнень",
              "filter_all": "Всі",
              "filter_achieved": "Розблоковані",
              "filter_locked": "В процесі",
              "discover_more": "Відкрити більше",
              "more_trophies": "+{{count}} Трофеїв",
              "share_error": "Не вдалося згенерувати зображення 😔",
              "share_default_title": "Моє досягнення!",
              "share_gold_title": "Золотий трофей!",
              "share_gold_text": "Я здобув спеціальний Золотий Трофей: {{title}}! 🏆\n\nСпробуй мене перевершити! Приєднуйся до виклику в нашому додатку:\n👉 {{url}}",
              "share_default_text": "Чергова ціль досягнута: {{title}}! 🔥\n\nТренуйся разом зі мною. Завантажуй додаток і починай:\n👉 {{url}}"
            }
          },
          "tracker": {
            "geolocation_not_supported": "Геолокація не підтримується",
            "error": "Помилка: ",
            "activity": "Активність",
            "live": "LIVE",
            "offline": "ОФЛАЙН",
            "distance": "Відстань",
            "speed": "Швидкість",
            "ready_to_start": "Готові до старту?",
            "waiting_for_gps": "Очікування GPS",
            "stop_workout": "Зупинити тренування",
            "start_workout": "Почати тренування",
            "summary": "Підсумок",
            "rate_workout": "Оцініть своє тренування",
            "distance_short": "Дистанція",
            "time_short": "Час",
            "intensity": "Інтенсивність",
            "mood": "Настрій",
            "save_workout": "Зберегти тренування",
            "default_name": "GPS Тренування"
          },
          "goal_tracker": {
            "status_exceeded": "🌟 Ціль перевиконано!",
            "status_completed": "🎯 Ціль досягнуто!",
            "status_keep_going": "💪 Продовжуй так само!",
            "weekly_goal_title": "Тижнева ціль",
            "complete_prefix": "Виконайте",
            "complete_suffix": "тренувань цього тижня.",
            "streak_days": "🔥 {{count}} днів поспіль",
            "of_goal": "з {{goal}}",
            "daily_calories_title": "Денна Ціль Калорій",
            "burned_today": "Спалено сьогодні",
            "status_cal_completed": "🎯 Денну ціль досягнуто!",
            "status_cal_exceeded": "🔥 Справжній Вогонь!",
            "status_cal_keep_going": "⚡ Спалюй далі!"
          },
          "activity_details": {
            "burned": "Спалено"
          }
        }
      }
    },
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;