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
                // Alle Kind-Objekte des Geistes deaktivieren
                foreach (Transform child in transform)
                {
                    if (child.GetComponent<MeshRenderer>() != null)
                    {
                        child.GetComponent<MeshRenderer>().enabled = false;
                    }
                    if (child.GetComponent<ParticleSystem>() != null)
                    {
                        child.GetComponent<ParticleSystem>().Stop();
                    }
                }
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