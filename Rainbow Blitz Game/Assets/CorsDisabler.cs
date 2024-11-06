using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuplex.WebView;


public class CorsDisabler : MonoBehaviour
{

    void Awake() {
      //WebViewPrefab webViewPrefab = GetComponent<WebViewPrefab>();
      //StandaloneWebView webView = webViewPrefab.WebView as StandaloneWebView;
      //StandaloneWebView.SetCommandLineArguments("--disable-gpu-compositing");
      Debug.Log("CORS disabled");
    } 

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
