using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputManager : MonoBehaviour
{
    public static InputManager instance;

    private Dictionary<string, KeyCode> keys = new Dictionary<string, KeyCode>();
    private Dictionary<string, bool> pressedKeys = new Dictionary<string, bool>();

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }

        // Default keys
        keys.Add("Forward", KeyCode.W);
        keys.Add("Backward", KeyCode.S);
        keys.Add("Left", KeyCode.A);
        keys.Add("Right", KeyCode.D);
    }

    void OnGUI()
    {
        Event e = Event.current;
        if (e.isKey)
        {
            HandleKeyPress(e);
        }
    }

    void HandleKeyPress(Event e)
    {
        foreach (var key in keys)
        {
            if (e.keyCode == key.Value)
            {
                if (e.type == EventType.KeyDown)
                {
                    pressedKeys[key.Key] = true;
                    //Debug.Log(key.Key + " is pressed");
                }
                else if (e.type == EventType.KeyUp)
                {
                    pressedKeys[key.Key] = false;
                    //Debug.Log(key.Key + " is released");
                }
            }
        }
    }

    public KeyCode GetKeyForAction(string action)
    {
        if (keys.ContainsKey(action))
        {
            return keys[action];
        }
        return KeyCode.None;
    }

    public void SetKeyForAction(string action, KeyCode key)
    {
        if (keys.ContainsKey(action))
        {
            keys[action] = key;
        }
        else
        {
            keys.Add(action, key);
        }
    }

    public bool GetKey(string action)
    {
        if (pressedKeys.ContainsKey(action))
        {
            return pressedKeys[action];
        }
        return false;
    }
}
