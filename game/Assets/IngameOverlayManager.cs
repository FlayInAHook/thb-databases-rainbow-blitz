using UnityEngine;

public class IngameOverlayManager : MonoBehaviour
{
    private static IngameOverlayManager _instance;

    void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
