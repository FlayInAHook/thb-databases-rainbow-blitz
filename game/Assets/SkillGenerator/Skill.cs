using System.ComponentModel;
using UnityEngine;

[CreateAssetMenu(fileName = "New Skill", menuName = "Skills/Skill")]
public class Skill : ScriptableObject
{
    public SkillType skillType;
    public Color skillColor;
    public int ammo;
    public SkillGunType gunType;
    public GameObject bulletPrefab;
    public float bulletSpeed;
    public int pelletCount;
    public float spreadRadius;

    public float delayBetweenBullets;
    public int damage;

}

public enum SkillType { Updraft, Dash, Stomp }

public enum SkillGunType { Pistol, Shotgun, Sniper, SNG } // Add more gun types as needed
