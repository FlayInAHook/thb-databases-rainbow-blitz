using UnityEngine;

public class GhostCollider : MonoBehaviour
{
    bool isFirstCollision = true;
    bool hasExited = false;

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.tag == "Player")
        {
            if (isFirstCollision)
            {
                isFirstCollision = false;
            }
            else if (hasExited)
            {
                gameObject.SetActive(false);
            }
        }
    }

    void OnTriggerExit(Collider other)
    {
        if (other.gameObject.tag == "Player")
        {
            hasExited = true;
        }
    }
}