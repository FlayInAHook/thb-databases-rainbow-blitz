using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements.InputSystem;
using Vuplex.WebView;

public interface IDatabasePoster
{
    void PostDbMessage(string message);
    string LevelID { get; }
    void RegisterFinishedNotification(Action finishedAction);
}

public class LevelManager : MonoBehaviour, IDatabasePoster
{

    public void RegisterFinishedNotification(Action finishedAction)
    {
        FinishedAction = finishedAction;
    }

    private Action? FinishedAction;
    GameObject hotbarContainer;
    public GameObject canvasWebViewPrefab;
    private static GameObject ingameOverlay;

    private CanvasWebViewPrefab webViewPrefab;

    public bool canMove = false;
    private bool restartSpace = false;
    private int updates = 0;

    private bool spaceWasHeld = false;

    private TimerDisplay timerDisplay;
    void Start()
    {
        hotbarContainer = GameObject.Find("HotbarContainer");
        if (ingameOverlay == null)
        {
            ingameOverlay = Instantiate(canvasWebViewPrefab);
            ingameOverlay.name = "IngameOverlay";
            DontDestroyOnLoad(ingameOverlay);
        }
        else
        {
            Debug.Log("IngameOverlay already exists. Not creating a new one.");
        }
        webViewPrefab = ingameOverlay.transform.GetChild(0).GetComponent<CanvasWebViewPrefab>();
        timerDisplay = GameObject.Find("Timer").GetComponent<TimerDisplay>();
        //DontDestroyOnLoad(this.gameObject);

        ingameOverlay.SetActive(true);
        hotbarContainer.SetActive(false);
        Time.timeScale = 0;
        //Input.ResetInputAxes();
        //InputManager.instance.afterFirstFrame = false;
        //InputManager.instance.enabled = false;

    }

    const int updatesToWait = 3;

    private bool IsIngameOverlay => webViewPrefab.WebView.Url.Contains("ingameoverlay");

    // Update is called once per frame
    void Update()
    {
        // if the f key is pressed, reload the scene
        if (!ingameOverlay.activeSelf && Input.GetKeyDown(KeyCode.F) && IsIngameOverlay)
        {
            OnRestart();
        }
        if (Input.GetKeyDown(KeyCode.Escape) && IsIngameOverlay)
        {
            onEscape();
        }


        if (updates < updatesToWait && Input.GetKey(KeyCode.Space))
        {
            spaceWasHeld = true;
            updates = updatesToWait;
            //Debug.Log("was held in first frame");
        }

        if (spaceWasHeld && Input.GetKeyUp(KeyCode.Space))
        {
            spaceWasHeld = false;
        }

        if (!spaceWasHeld && ingameOverlay.activeSelf && Input.GetKeyDown(KeyCode.Space))
        {
            restartSpace = true;
        }
        if (updates == updatesToWait && !spaceWasHeld && Input.GetKeyUp(KeyCode.Space) && restartSpace && IsIngameOverlay)
        {
            restartSpace = false;
            ingameOverlay.SetActive(false);
            hotbarContainer.SetActive(true);
            canMove = true;
            Time.timeScale = 1;
            Debug.Log("Space pressed");
            //InputManager.instance.enabled = true;
        }

        if (updates == updatesToWait - 1)
        {
            PostDbMessage("{\"type\": \"LEVEL_ID\", \"data\": {\"levelID\": \"" + StaticInfo.GetLevelID(SceneManager.GetActiveScene().name) + "\"}}");
        }

        if (updates < updatesToWait)
        {
            updates++;
        }
    }

    public void onEscape()
    {
        canMove = false;
        ingameOverlay.SetActive(true);
        hotbarContainer.SetActive(false);
        PostDbMessage("{\"type\": \"OPEN_ESCAPE_MENU\"}");
        Debug.Log("Escape pressed");
        // unlock the cursor
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }

    public void PostDbMessage(string message) => webViewPrefab.WebView.PostMessage(message);

    public string LevelID => StaticInfo.GetLevelID(SceneManager.GetActiveScene().name);
    public void onResume()
    {
        canMove = true;
        ingameOverlay.SetActive(false);
        hotbarContainer.SetActive(true);
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    public void OnFinished()
    {
        FinishedAction?.Invoke();
        Reload();
        PostDbMessage("{\"type\": \"FINISHED_LEVEL\", \"data\": {\"time\":\"" + timerDisplay.GetElapsedTime().ToString("F3").Replace(",", "") + "\"" +
                                          ",\"levelID\": \"" + LevelID + "\"}}");
    }

    public void OnRestart()
    {
        Reload();
        PostDbMessage("{\"type\": \"RESTART_LEVEL\"}");
    }


    public void onPlayerDeath()
    {
        ingameOverlay.SetActive(true);
        hotbarContainer.SetActive(false);
        Time.timeScale = 0;

        // send stuff to the ui
    }

    private static Transform[] allObjects;

    public void Reload()
    {
        //Find & destroy all objects in scene

        //allObjects = FindObjectsOfType(typeof(Transform)) as Transform[];

        /*foreach (Transform t in allObjects)
        {
          if (t.gameObject.name == "IngameOverlay") continue;
            Destroy (t.gameObject);
        }*/


        //Application.LoadLevelAdditive (Application.loadedLevel);
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        //Debug.Log(SceneManager.sceneCount);


    }
}
