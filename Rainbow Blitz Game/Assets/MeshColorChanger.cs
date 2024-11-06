using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshColorChanger : MonoBehaviour // changes the color of the mesh
{
    public Material material;
    public Color color;

    void Start()
    {
        material = GetComponent<MeshRenderer>().material;
        material.color = color;
    }

    public void ChangeColor(Color newColor)
    {
        StartCoroutine(ChangeColorAfterDelay(newColor));
    }

    private void _ChangeColor(Color newColor)
    {
      material = GetComponent<MeshRenderer>().material;
      material.color = newColor;
      color = newColor;
    }

    IEnumerator ChangeColorAfterDelay(Color newColor)
    {
      yield return new WaitForEndOfFrame();
      _ChangeColor(newColor);
    }
}

