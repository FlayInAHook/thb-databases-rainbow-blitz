using UnityEngine;
using System.IO;
using System;
using System.Text;
using System.Data.Common;
using UnityEngine.SceneManagement;
using System.Linq;

public class PlayerPositionLogger : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        var logFilePath = @"C:\temp\Uni\RainbowBlitzLog.txt";// Path.Combine(Application.persistentDataPath, "PlayerPositionLog.txt");
        if (!File.Exists(logFilePath))
        {
            LogStream = File.OpenWrite(logFilePath);
        }
        SB = new();

        DatabasePoster.RegisterFinishedNotification(timeStr =>
        {
            LogStream?.Close();
            if (DatabasePoster is { })
            {
                // keine ahnung, wie man das in die DB bekommt - es sieht nicht so aus, als w�rde irgendwas die dbConnection verwenden.
                DatabasePoster.PostDbMessage(@$"{{
    ""type"":""LEVEL_TRACE"",
    ""data"":
    {{
    ""time"":""{timeStr}"",
    ""levelID"":""{DatabasePoster.LevelID}"",
    ""log"":""{SB}""
    }}
}}");
            }
        });
    }
    FileStream LogStream;
    StringBuilder SB;

    [SerializeField]
    public MonoBehaviour DatabasePosterBehaviour;
    private IDatabasePoster DatabasePoster => DatabasePosterBehaviour as IDatabasePoster;

    public float logInterval = 0.1f; // Interval in seconds
    private float nextLogTime = 0f;

    void Update()
    {
        if (TimerDisplay.elapsedTime >= nextLogTime)
        {
            nextLogTime = TimerDisplay.elapsedTime + logInterval;
            LogCharacterPositionAndOrientation();
        }
    }

    void LogCharacterPositionAndOrientation()
    {
        var time = TimerDisplay.elapsedTime;
        Vector3 position = transform.position;
        Quaternion orientation = transform.rotation;
        var logLine = $"{time} {position.x} {position.y} {position.z} {orientation.x} {orientation.y} {orientation.z} {orientation.w}";
        SB.Append(logLine);
        SB.Append("END");
        LogStream?.Write(Encoding.UTF8.GetBytes(logLine).AsSpan());
        LogStream?.Write(NewLineBytes);
    }

    byte[] NewLineBytes = Encoding.UTF8.GetBytes("\n");
}
