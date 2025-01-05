using System.Collections.Generic;
using System.IO;
using System.Linq;
using JetBrains.Annotations;
using UnityEngine;

public class Ghost : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        Debug.Log("Ghost Start" + StartTime);

        var logFilePath = @"C:\temp\Uni\Ghost.txt";// Path.Combine(Application.persistentDataPath, "PlayerPositionLog.txt");
        if (File.Exists(logFilePath))
        {
            var lines = File.ReadAllLines(logFilePath);
            Infos = new Stack<string[]>(lines.Select(line => line.Split(' ')).Reverse());
            if (Infos.TryPeek(out var firstInfo))
            {
                StartTime = float.Parse(firstInfo[0]);
            }
            Debug.Log("Start" + StartTime);
        }
        //         var logLine = $"{Time.time}, {position.x}, {position.y}, {position.z}, {orientation.x}, {orientation.y}, {orientation.z}, {orientation.w}\n";
    }

    float StartTime = 0;
    Stack<string[]> Infos;
    (bool Valid, string[] parts, float Time, Vector3 Position, Quaternion Orientation) Current;
    bool Stopped = false;

    // Update is called once per frame
    void Update()
    {
        if (Stopped) return;

        if (Current.Valid)
        {
            if (Time.time > Current.Time)
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
                var time = float.Parse(info[0]) - StartTime;
                var position = new Vector3(float.Parse(info[1]), float.Parse(info[2]), float.Parse(info[3]));
                var orientation = new Quaternion(float.Parse(info[4]), float.Parse(info[5]), float.Parse(info[6]), float.Parse(info[7]));
                Current = (true, info, time, position, orientation);
                
            }
            else
            {
                Stopped = true;
            }
        }
    }
}
