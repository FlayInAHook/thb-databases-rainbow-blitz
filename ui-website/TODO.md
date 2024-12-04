Hier schreiben wir rein, was wir machen wollen, und das wird super.

    [Alex] game-code durchgucken, um zu schaun, wo wir tracing hooken können
[Bjarne] gesund aus den USA zurückkommen
    [Tim] erste Datenbank-Anbindung für leaderboard.
    [Tim] gitignore für die config.json vorbereiten, sodass der link zum mongodb nicht in die Quelltextverwaltung kommt.
[Tim] MongoDb vorbereiten für die Daten aus dem PositionLogger:
  - Player ID
  - Level ID
  - Level Data: Json Array von:
    - Timestamp (float)
    - Location x y z (floats, Coords)
    - Orientation a b c d (floats, Quaternion)
[Alex] 
  - LevelManager-Interface erzeugen, mit dem in die DB geschrieben werden kann
  - PlayerPositionLogger dieses übergeben
  - das Log in die DB schreiben
  
[Bjarne]
  - Unity updaten, quellen holen, testen, ob's geht, Alex bescheidsagen
  - Ghost und Logger automatisch dynamisch dem Level hinzufügen, damit es nicht nur im DebugLevel geht