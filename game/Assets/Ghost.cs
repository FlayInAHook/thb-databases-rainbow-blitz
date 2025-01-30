using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using JetBrains.Annotations;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Ghost : MonoBehaviour
{

    public static GameObject GhostPrefab;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {       
        //Debug.Log("Ghost Start" + StartTime);

        //var logFilePath = @"C:\temp\Uni\Ghost.txt";// Path.Combine(Application.persistentDataPath, "PlayerPositionLog.txt");
        //if (File.Exists(logFilePath))
        //{
        //    var lines = File.ReadAllLines(logFilePath);
        //    Infos = new Stack<string[]>(lines.Select(line => line.Split(' ')).Reverse());
        //    if (Infos.TryPeek(out var firstInfo))
        //    {
        //        StartTime = float.Parse(firstInfo[0]);
        //    }
        //    Debug.Log("Start" + StartTime);
        //}
        //         var logLine = $"{Time.time}, {position.x}, {position.y}, {position.z}, {orientation.x}, {orientation.y}, {orientation.z}, {orientation.w}\n";
    }

    public void LoadData(string data)
    {
        Infos = new(data.Split(@"END", StringSplitOptions.RemoveEmptyEntries).Reverse().Select(s => s.Replace(',', '.').Split(" ")));

        if (Infos.TryPeek(out var first))
        {
            StartTime = float.Parse(first[0], CultureInfo.InvariantCulture);
        }   
    }

    float StartTime = 0;
    Stack<string[]> Infos;
    (bool Valid, string[] parts, float Time, Vector3 Position, Quaternion Orientation) Current;
    bool Stopped = false;
    // Update is called once per frame
    void Update()
    {
        if (Stopped) return;
        var elapsedTime = TimerDisplay.elapsedTime;
        if (Current.Valid)
        {
            if (elapsedTime > Current.Time)
            {
                //Debug.Log("Moving at" + Current.Time);
                transform.position = Current.Position;
                transform.rotation = Current.Orientation;
                Current.Valid = false;
            }
        }
        else
        {
            if (Infos?.TryPop(out var info) ?? false)
            {
                var time = float.Parse(info[0], CultureInfo.InvariantCulture) - StartTime;
                var position = new Vector3(float.Parse(info[1], CultureInfo.InvariantCulture), float.Parse(info[2], CultureInfo.InvariantCulture), float.Parse(info[3], CultureInfo.InvariantCulture));
                var orientation = new Quaternion(float.Parse(info[4], CultureInfo.InvariantCulture), float.Parse(info[5], CultureInfo.InvariantCulture), float.Parse(info[6], CultureInfo.InvariantCulture), float.Parse(info[7], CultureInfo.InvariantCulture));
                Current = (true, info, time, position, orientation);

            }
            else
            {
                Stopped = true;
            }
        }
    }
}
