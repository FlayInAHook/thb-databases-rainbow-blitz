using System.Collections;
using UnityEngine;
using TMPro;

public class HelpNotification : MonoBehaviour
{
    public TextMeshProUGUI helpText;
    public float fadeOutDuration = 2f;
    public float displayDuration = 5f;

    void Start()
    {
        StartCoroutine(DisplayAndFadeOutText());
    }

    IEnumerator DisplayAndFadeOutText()
    {
        // Text sichtbar
        Color textColor = helpText.color;
        textColor.a = 1f;
        helpText.color = textColor;

        // 5 Sekunden warten
        yield return new WaitForSeconds(displayDuration);

        // Ausblenden
        float elapsedTime = 0f;
        while (elapsedTime < fadeOutDuration)
        {
            elapsedTime += Time.deltaTime;
            float alpha = Mathf.Clamp01(1 - (elapsedTime / fadeOutDuration));
            helpText.color = new Color(textColor.r, textColor.g, textColor.b, alpha);
            yield return null;
        }
    }
}
