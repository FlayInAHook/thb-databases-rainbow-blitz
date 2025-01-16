using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Unity.VisualScripting;
using UnityEditor.ShaderGraph.Serialization;
using UnityEngine;
using UnityEngine.SceneManagement;
using Vuplex.WebView;

public class Message
{
    public string type;
    public string content;

}

public class GhostDataMessage
{
    public string type;
    public string content;
}

public class UserLevelData
{
    public int levelID;
    public string ghostData;
}


public class UIMessageListener : MonoBehaviour
{
    // Start is called before the first frame update

    GameObject? GhostPrefab;

    private CanvasWebViewPrefab webViewPrefab;
    async void Start()
    {
        webViewPrefab = GetComponent<CanvasWebViewPrefab>();
        //log to see if the component is found
        Debug.Log("WebviewPrefab found: " + webViewPrefab);
        await webViewPrefab.WaitUntilInitialized();

        SceneManager.sceneLoaded += (Scene scene, LoadSceneMode mode) =>
        {
            if (this.IsDestroyed())
            {
                return;
            }
            var character = scene.GetRootGameObjects().FirstOrDefault(go => go.name == "Character");
            var levelManager = scene.GetRootGameObjects().FirstOrDefault(go => go.name == "LevelManager");

            if (character != null && levelManager != null)
            {
                var logger = character.AddComponent<PlayerPositionLogger>();
                logger.DatabasePosterBehaviour = levelManager.GetComponent<IDatabasePoster>() as MonoBehaviour;
            }
            Object ghostPrefabObject = Resources.Load("GhostPrefab");
            GhostPrefab = ghostPrefabObject as GameObject;

            // Optionally, set the parent of the new GameObject
            GhostPrefab.transform.SetParent(transform);

            //if (GhostInfoByLevel.TryGetValue(StaticInfo.GetLevelID(), out var ghostInfo))
            //{
            //    var ghost = GhostPrefab.GetComponent<Ghost>();
            //        if (ghost is { })
            //        {
            //            ghost.LoadData(ghostInfo);
            //        }
            //}
        };

        //webViewPrefab.WebView.Resize(1980, 1080);
        webViewPrefab.WebView.MessageEmitted += (sender, eventArgs) =>
        {
            Debug.Log("Message received: " + eventArgs.Value);
            //webViewPrefab.WebView.PostMessage("{\"type\": \"greeting\", \"message\": \"Hello from C#!\"}");
            // eventArgs.Value is a json string and I want to get the value of the key "type" but the type is not known
            var message = JsonUtility.FromJson<Message>(eventArgs.Value);
            if (message.type == "loadLevel")
            {
                var sceneName = StaticInfo.GetLevelName(message.content);
                SceneManager.LoadScene(sceneName);
            }
            if (message.type == "REQUEST_UNIQUE_ID")
            {
                webViewPrefab.WebView.PostMessage("{\"type\": \"UNIQUE_ID\", \"data\": \"" + SystemInfo.deviceUniqueIdentifier + "\"}");
            }
            if (message.type == "RESUME_GAME")
            {
                GameObject.Find("LevelManager").GetComponent<LevelManager>().onResume();
            }
            if (message.type == "RESTART_GAME")
            {
                GameObject.Find("LevelManager").GetComponent<LevelManager>().OnRestart();
            }
            if (message.type == "GO_TO_LEVEL_SELECT")
            {
                SceneManager.LoadScene("MainMenu");
                StaticInfo.MAIN_MENU_STATE = "LEVEL_SELECT";
            }
            if (message.type == "GO_TO_MAIN_MENU")
            {
                SceneManager.LoadScene("MainMenu");
                StaticInfo.MAIN_MENU_STATE = "MAIN_MENU";
            }
            if (message.type == "KILL_GAME")
            {
                Application.Quit();
            }
            if (message.type == "SENSITIVITY")
            {
                StaticInfo.SENSITIVITY = float.Parse(message.content, CultureInfo.InvariantCulture);
                Debug.Log("Sensitivity set to: " + StaticInfo.SENSITIVITY);
            }
            if (message.type == "USER_LEVEL_DATA")
            {
                var ghostDataMessage = JsonUtility.FromJson<GhostDataMessage>(eventArgs.Value);
                if (ghostDataMessage.type == "USER_LEVEL_DATA")
                {
                    var userLevelData = JsonUtility.FromJson<UserLevelData>(ghostDataMessage.content);
                    Debug.Log("Received user level data: " + userLevelData.levelID + " " + userLevelData.ghostData);
                    GhostInfoByLevel[userLevelData.levelID.ToString()] = userLevelData.ghostData;
                    if (GhostPrefab is { } gp)
                    {
                        var ghostInstance = GameObject.Instantiate(gp);
                        if (ghostInstance.GetComponent<Ghost>() is { } ghost)
                        {
                            ghost.LoadData(userLevelData.ghostData);
                        }
                    }
                }
            }
        };
    }



    private static Dictionary<string, string> GhostInfoByLevel = new();

    // Update is called once per frame
    void Update()
    {

    }
}
