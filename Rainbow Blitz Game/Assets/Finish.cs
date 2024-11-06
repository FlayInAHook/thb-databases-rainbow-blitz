using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Finish : MonoBehaviour
{
    
    TimerDisplay timerDisplay;
    LevelManager levelManager;
    GameObject enemies;

    void Start()
    {
      timerDisplay = GameObject.Find("Timer").GetComponent<TimerDisplay>();
      levelManager = GameObject.Find("LevelManager").GetComponent<LevelManager>();
      enemies = GameObject.Find("Enemies");
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void OnTriggerEnter(Collider other) {
      
      if (other.gameObject.tag == "Player") {
        if (enemies == null) enemies = GameObject.Find("Enemies");
        if (enemies.transform.childCount > 0) return;
        if (timerDisplay == null) timerDisplay = GameObject.Find("Timer").GetComponent<TimerDisplay>();
        if (levelManager == null) levelManager = GameObject.Find("LevelManager").GetComponent<LevelManager>();
        
        timerDisplay.StopTimer();
        levelManager.OnFinished();
      }
    }
}
