using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuplex.WebView;

public class MainMenuChanger : MonoBehaviour
{
    // Start is called before the first frame update
    async void Start()
    {
        /*CanvasWebViewPrefab webViewPrefab = GetComponent<CanvasWebViewPrefab>();
        await webViewPrefab.WaitUntilInitialized();
        string url = webViewPrefab.WebView.Url;
        // remove everything after the last slash
        Debug.Log("URL: " + url);
        url = url.Substring(0, url.LastIndexOf("/"));
        Debug.Log("URL: " + url);
        if (StaticInfo.MAIN_MENU_STATE == "MAIN_MENU")
        {
            webViewPrefab.WebView.LoadUrl(url + "/");
        }
        else if (StaticInfo.MAIN_MENU_STATE == "LEVEL_SELECT")
        {
            webViewPrefab.WebView.LoadUrl(url + "/selectLevel");
        }*/

    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
