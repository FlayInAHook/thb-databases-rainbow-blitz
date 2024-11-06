using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using UnityEngine;
using UnityEngine.SceneManagement;
using Vuplex.WebView;

public class Message
{
    public string type;
    public string content;
}

public class UIMessageListener : MonoBehaviour
{
    // Start is called before the first frame update

    private CanvasWebViewPrefab webViewPrefab;
    async void Start()
    {
        webViewPrefab = GetComponent<CanvasWebViewPrefab>();
        //log to see if the component is found
        Debug.Log("WebviewPrefab found: " + webViewPrefab);
        await webViewPrefab.WaitUntilInitialized();
        //webViewPrefab.WebView.Resize(1980, 1080);
        webViewPrefab.WebView.MessageEmitted += (sender, eventArgs) => {
            Debug.Log("Message received: " + eventArgs.Value);
            //webViewPrefab.WebView.PostMessage("{\"type\": \"greeting\", \"message\": \"Hello from C#!\"}");
            // eventArgs.Value is a json string and I want to get the value of the key "type" but the type is not known
            var message = JsonUtility.FromJson<Message>(eventArgs.Value);
            if (message.type == "loadLevel"){
              SceneManager.LoadScene(StaticInfo.GetLevelName(message.content));
            }
            if (message.type == "REQUEST_UNIQUE_ID"){
              webViewPrefab.WebView.PostMessage("{\"type\": \"UNIQUE_ID\", \"data\": \"" + SystemInfo.deviceUniqueIdentifier + "\"}");
            }
            if (message.type == "RESUME_GAME"){
              GameObject.Find("LevelManager").GetComponent<LevelManager>().onResume();
            }
            if (message.type == "RESTART_GAME"){
              GameObject.Find("LevelManager").GetComponent<LevelManager>().OnRestart();
            }
            if (message.type == "GO_TO_LEVEL_SELECT") {
              SceneManager.LoadScene("MainMenu");
              StaticInfo.MAIN_MENU_STATE = "LEVEL_SELECT";
            }
            if (message.type == "GO_TO_MAIN_MENU") {
              SceneManager.LoadScene("MainMenu");
              StaticInfo.MAIN_MENU_STATE = "MAIN_MENU";
            }
            if (message.type == "KILL_GAME") {
              Application.Quit();
            }
            if (message.type == "SENSITIVITY") {
              StaticInfo.SENSITIVITY = float.Parse(message.content, CultureInfo.InvariantCulture);
              Debug.Log("Sensitivity set to: " + StaticInfo.SENSITIVITY);
            }
        };
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
