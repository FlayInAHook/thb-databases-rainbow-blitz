using System.Collections.Generic;

public static class StaticInfo {
  public static string MAIN_MENU_STATE = "MAIN_MENU";
  public static float SENSITIVITY = 1.0f;

  // map for level ID and level name
  public static Dictionary<string, string> LEVELS = new Dictionary<string, string>(){
    {"1", "Level 1"},
    {"2", "Level 2"},
    {"3", "Level 3"},
    {"7777", "Debug Level"},
  };

  public static string GetLevelName(string levelID){
    return LEVELS[levelID];
  }

  public static string GetLevelID(string levelName){
    foreach (KeyValuePair<string, string> entry in LEVELS){
      if (entry.Value == levelName){
        return entry.Key;
      }
    }
    return null;
  }
}