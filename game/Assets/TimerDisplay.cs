using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;


public class TimerDisplay : MonoBehaviour
{
    private TextMeshProUGUI timerText;
    private float elapsedTime;
    private bool isRunning = true;

    void Start()
    {
        elapsedTime = 0f;
        timerText = GetComponent<TextMeshProUGUI>();
    }

    void Update() { 
      if (isRunning) {
        elapsedTime += Time.deltaTime;
        DisplayTime(elapsedTime);
      }
    }

    void DisplayTime(float timeToDisplay)
    {
        timerText.text = GetFormattedTime();
    }

    public string GetFormattedTime()
    {
        float minutes = Mathf.FloorToInt(elapsedTime / 60); 
        float seconds = Mathf.FloorToInt(elapsedTime % 60);
        float milliseconds = (elapsedTime % 1) * 1000;

        return string.Format("{0:00}:{1:00}:{2:000}", minutes, seconds, Mathf.FloorToInt(milliseconds));
    }

    public float GetElapsedTime()
    {
        return elapsedTime;
    }


    public void ResetTimer()
    {
        elapsedTime = 0f;
    }

    public void StopTimer()
    {
        isRunning = false;
    }

    public void StartTimer()
    {
        isRunning = true;
    }

}
