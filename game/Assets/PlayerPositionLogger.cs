using UnityEngine;
using System.IO;
using System;
using System.Text;

public class PlayerPositionLogger : MonoBehaviour, IDisposable
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        var logFilePath = @"C:\temp\Uni\RainbowBlitzLog.txt";// Path.Combine(Application.persistentDataPath, "PlayerPositionLog.txt");
        if (!File.Exists(logFilePath))
        {
            LogStream = File.OpenWrite(logFilePath);
        }
    }
    FileStream LogStream;

    public float logInterval = 0.1f; // Interval in seconds
    private float nextLogTime = 0f;

    void Update()
    {
        if (Time.time >= nextLogTime)
        {
            LogCharacterPositionAndOrientation();
            nextLogTime = Time.time + logInterval;
        }
    }

    void LogCharacterPositionAndOrientation()
    {
        Vector3 position = transform.position;
        Quaternion orientation = transform.rotation;
        var logLine = $"{Time.time} {position.x} {position.y} {position.z} {orientation.x} {orientation.y} {orientation.z} {orientation.w}\n";
        LogStream?.Write(Encoding.UTF8.GetBytes(logLine).AsSpan());
    }

    void IDisposable.Dispose()
    {
        LogStream?.Close();
    }
}
