using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class DestructableHealth : MonoBehaviour
{
    public int maxHealth = 100;
    private int currentHealth;
    public GameObject healthBarPrefab;
    private GameObject healthBar;
    private Image healthBarImage;
    private Image healthBarForegroundImage;
    private Camera playerCameraComponent;

    private int hitTick = 0;

    Color originalColor;

    void Start()
    {
        currentHealth = maxHealth;
        healthBar = Instantiate(healthBarPrefab, transform.position + Vector3.up * 2, Quaternion.identity, transform);
        healthBarImage = healthBar.transform.GetChild(0).GetComponent<Image>();
        healthBarForegroundImage = healthBar.transform.GetChild(0).GetChild(0).GetComponent<Image>();
        healthBar.SetActive(false);
        playerCameraComponent = GameObject.Find("PlayerCamera").GetComponent<Camera>();
        
        // scale the canvas to be as wide as the object it's attached to
        healthBar.transform.localScale = new Vector3(0.03f, 0.03f, 0.03f);
    }

    void Update()
    {
        healthBar.transform.LookAt(playerCameraComponent.transform);
        healthBar.transform.Rotate(0, 180, 0);
    }

    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        UpdateHealthBar();
        if (currentHealth <= 0)
        {
          Die();
        }
        else
        { 
          hitTick++;
          StartCoroutine(FlashRed());
          StartCoroutine(ShowHealthBar());
        }
    }

    void UpdateHealthBar()
    {
        float healthRatio = (float)currentHealth / maxHealth;
        healthBarForegroundImage.fillAmount = healthRatio;
    }

    IEnumerator FlashRed()
    {
        MeshColorChanger meshColorChanger = GetComponent<MeshColorChanger>();
        if (originalColor == null) originalColor = meshColorChanger.color;
        meshColorChanger.ChangeColor(Color.red);
        int oldHitTick = hitTick;
        yield return new WaitForSeconds(0.2f);
        if (oldHitTick != hitTick) yield break;
        meshColorChanger.ChangeColor(originalColor);
    }

    IEnumerator ShowHealthBar()
    {
        healthBar.SetActive(true);
        int oldHitTick = hitTick;
        yield return new WaitForSeconds(2f);
        if (oldHitTick != hitTick) yield break;
        healthBar.SetActive(false);
    }

    public void Die()
    {
        // Handle enemy death (e.g., play animation, remove enemy)
        Destroy(gameObject);
    }
}
