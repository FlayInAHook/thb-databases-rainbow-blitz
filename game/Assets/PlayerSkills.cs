using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerSkills : MonoBehaviour
{
    // Using a dictionary to keep track of skill counts
    private Dictionary<SkillType, int> skillCounts = new Dictionary<SkillType, int>();
    private Dictionary<SkillType, int> skillAmmo = new Dictionary<SkillType, int>();
    private CharacterController controller;
    private FirstPersonController firstPersonController;

    public float dashDistance = 30.0f; // Distance to dash
    public float dashSpeed = 12.0f; // Speed of the dash

    private bool isDashing;
    private Vector3 dashDirection;

    public float updraftDistance = 7.0f; // Distance to updraft
    public float updraftSpeed = 5.5f; // Speed of the updraft
    private bool isUpdrafting;
    private Vector3 updraftDirection;

    public bool isGravityBlocked = false;


    private GameObject hotbarContainer;
    private HotbarUI hotbarUI;

    public bool isUsingSkill { get { return isDashing || isUpdrafting; } }
    
    [SerializeField]
    public SkillDatabase skillDatabase;

    public static SkillDatabase skillDatabaseStatic;

    private Camera cameraComponent;
    private GameObject ammoDisplayObject;
    private Vector3 ammoDisplayScale;
    private MeshColorChanger ammoDisplayColorChanger;

    private LevelManager levelManager;
    

    void Start()
    {
        skillDatabaseStatic = skillDatabase;
        levelManager = GameObject.Find("LevelManager").GetComponent<LevelManager>();
        controller = GetComponent<CharacterController>();
        firstPersonController = GetComponent<FirstPersonController>();
        //hotbarUI = hotbarContainer.transform.GetChild(0).GetComponent<HotbarUI>();
        cameraComponent = GetComponentInChildren<Camera>();
        ammoDisplayObject = GameObject.Find("AmmoDisplay");
        ammoDisplayScale = ammoDisplayObject.transform.localScale;
        ammoDisplayColorChanger = ammoDisplayObject.GetComponent<MeshColorChanger>();
        // Initialize dictionary with all possible skills and zero count
        foreach (SkillType skill in System.Enum.GetValues(typeof(SkillType)))
        {
            skillCounts[skill] = 0;
            skillAmmo[skill] = 0;
        }
    }

    void Update()
    {
        if (!levelManager.canMove) return;
        if (hotbarUI == null) hotbarUI = GameObject.Find("HotbarContainer").transform.GetChild(0).GetComponent<HotbarUI>();

       
        if (Input.GetMouseButtonDown(1)) // Right mouse button
        {
            UseSkill(hotbarUI.selectedSkill);
        }
        if (Input.GetMouseButtonDown(0)) // Left mouse button
        {
            Shoot(hotbarUI.selectedSkill);
        }

        
        if (isDashing) Dash();
        if (isUpdrafting) Updraft();

        DisplayAmmo(hotbarUI.selectedSkill);
        UpdateHotbarUI();
    }

    private void UpdateHotbarUI() {
        int index = 0;
        foreach (SkillType skilltype in Enum.GetValues(typeof(SkillType))) {   
            hotbarUI.UpdateHotbarUI(skilltype, skillCounts[skilltype]);
            index++;
            
        }
    }

    public void AcquireSkill(SkillType skillType, bool debug = false)
    { 
      Skill skill = skillDatabase.GetSkill(skillType);
      if (skillCounts.ContainsKey(skillType))
      {
          skillCounts[skillType]++;
          if (debug) skillCounts[skillType] = 999;
      }

      if (skillAmmo.ContainsKey(skillType))
      {
          
          skillAmmo[skillType] += skill.ammo;
          int skillCount = skillCounts[skillType];
          if (skillAmmo[skillType] > skillCount*skill.ammo)
          {
              skillAmmo[skillType] = skillCount * skill.ammo;
          }
          if (debug) skillAmmo[skillType] = 999 * skill.ammo;
      }

      //Debug.Log("Acquired " + skill + ". New count: " + skillCounts[skill]);
      UpdatePlayerStats(); // Optionally update player stats immediately
      
    }

    public void DisplayAmmo(SkillType skillType)
    {
      
      Skill skill = skillDatabase.GetSkill(skillType);
      ammoDisplayColorChanger.ChangeColor(skill.skillColor);
      if (!skillAmmo.ContainsKey(skill.skillType)) return;

      float maxAmmo = skill.ammo * skillCounts[skill.skillType];
      float currentAmmo = skillAmmo[skill.skillType];

      if (currentAmmo == 0 || maxAmmo == 0) {
        ammoDisplayObject.transform.localScale = new Vector3(0, 0, 0);
        return;
      }; 
      maxAmmo = maxAmmo < currentAmmo ? currentAmmo : maxAmmo;

      float ammoRatio = currentAmmo / maxAmmo;

      
      ammoDisplayObject.transform.localScale = new Vector3(ammoDisplayScale.x * ammoRatio, ammoDisplayScale.y * ammoRatio, ammoDisplayScale.z * ammoRatio);
    }

    public int GetSkillCount(SkillType skill)
    {
        if (skillCounts.ContainsKey(skill))
        {
            return skillCounts[skill];
        }
        return 0;
    }

    public void UseSkill(SkillType skill)
    {
        CancelAllSkills();
        if (skillCounts.ContainsKey(skill) && skillCounts[skill] > 0)
        {
            skillCounts[skill]--; // Decrement the count for the used skill
            switch (skill)
            {
                case SkillType.Dash:
                    isDashing = true;
                    isGravityBlocked = true;
                    firstPersonController.RemoveVerticalVelocity();
                    Vector3 horizontalForward = new Vector3(transform.forward.x, 0, transform.forward.z).normalized;
                    dashDirection = horizontalForward * dashDistance;
                    break;
                case SkillType.Updraft: // should be a quick updraft, so the initial speed should be high, but then decay quickly
                    isUpdrafting = true;
                    isGravityBlocked = true;
                    firstPersonController.RemoveVerticalVelocity();
                    updraftDirection = Vector3.up * updraftDistance;
                    break;
                case SkillType.Stomp:
                    // Perform stomp logic
                    break;
                default:
                    break;
            }
            if (skillCounts[skill] == 0) {
              skillAmmo[skill] = 0;
            }
        }
    }

    public void Shoot(SkillType skillType)
    {
      Skill skill = skillDatabase.GetSkill(skillType);
      if (skillAmmo.ContainsKey(skillType) && skillAmmo[skillType] > 0)
      {
        skillAmmo[skillType]--;
        switch (skill.gunType)
        {
            case SkillGunType.Pistol:
                ShootPistol(skill);
                break;
            case SkillGunType.Shotgun:
                ShootShotgun(skill);
                break;
            case SkillGunType.Sniper:
                
                break;
            default:
                break;
        }
        if (skillAmmo[skillType] == 0) {
          skillCounts[skillType] = 0;
        }
      }
    }

    public void ShootPistol(Skill skill) {
      Transform cameraTransform = cameraComponent.transform;
      GameObject bullet = Instantiate(skill.bulletPrefab, cameraTransform.position, cameraTransform.rotation);
      //Rigidbody rb = bullet.GetComponent<Rigidbody>();
      //rb.velocity = cameraTransform.forward * skill.bulletSpeed;
      Bullet bulletScript = bullet.GetComponent<Bullet>();
      bulletScript.speed = skill.bulletSpeed;
      bulletScript.damage = skill.damage;
      bulletScript.origin = ShootOrigin.Player;
      MeshColorChanger meshColorChanger = bullet.GetComponent<MeshColorChanger>();
      meshColorChanger.ChangeColor(skill.skillColor);
    }

    public void ShootShotgun(Skill skill) {
      Transform cameraTransform = cameraComponent.transform;
      float spreadRadius = skill.spreadRadius; // Adjust this value to control the spread of the pellets

      GameObject centralBullet = Instantiate(skill.bulletPrefab, cameraTransform.position, cameraTransform.rotation);
      Bullet centralBulletScript = centralBullet.GetComponent<Bullet>();
      centralBulletScript.speed = skill.bulletSpeed;
      centralBulletScript.damage = skill.damage;
      centralBulletScript.origin = ShootOrigin.Player;
      MeshColorChanger centralMeshColorChanger = centralBullet.GetComponent<MeshColorChanger>();
      centralMeshColorChanger.ChangeColor(skill.skillColor);

      // Instantiate the spread pellets
      for (int i = 0; i < skill.pelletCount - 1; i++) {
        // Instantiate the pellet
        GameObject bullet = Instantiate(skill.bulletPrefab, cameraTransform.position, cameraTransform.rotation);
        Bullet bulletScript = bullet.GetComponent<Bullet>();
        bulletScript.speed = skill.bulletSpeed;
        bulletScript.damage = skill.damage;
        bulletScript.origin = ShootOrigin.Player;
        MeshColorChanger meshColorChanger = bullet.GetComponent<MeshColorChanger>();
        meshColorChanger.ChangeColor(skill.skillColor);

        // Calculate the spread
        float angle = i * (360f / (skill.pelletCount - 1)); // Angle for evenly distributed pellets

        // Calculate the offset position in the circular pattern
        Vector3 offset = new Vector3(
            Mathf.Cos(angle * Mathf.Deg2Rad) * spreadRadius,
            Mathf.Sin(angle * Mathf.Deg2Rad) * spreadRadius,
            0
        );

        // Apply the direction with spread
        Vector3 direction = cameraTransform.forward + cameraTransform.right * offset.x + cameraTransform.up * offset.y;
        bullet.transform.rotation = Quaternion.LookRotation(direction);
      }
    }


    private void Dash()
    {
        if (dashDirection.magnitude >= 0.3f)
        {
          Vector3 moveDistance = dashDirection * dashSpeed * Time.deltaTime;
          Vector3 futurePosition = transform.position + moveDistance;
          float detectionRadius = 1.0f;

          // Perform an overlap sphere to detect objects within the detection radius
          Collider[] hitColliders = Physics.OverlapSphere(futurePosition, detectionRadius);
          foreach (var hitCollider in hitColliders)
          {
              if (hitCollider.CompareTag("Destructable"))
              {
                  Vector3 toCollider = hitCollider.transform.position - transform.position;
                  // Check if the collider is within the half-circle in the dash direction
                  if (Vector3.Dot(toCollider.normalized, dashDirection.normalized) > 0)
                  {
                      // Execute a script on the destructible object
                      DestructableHealth destructableObject = hitCollider.GetComponent<DestructableHealth>();
                      if (destructableObject != null)
                      {
                          destructableObject.Die();
                      }
                  }
              }
          }


            controller.Move(dashDirection * dashSpeed * Time.deltaTime);
            dashDirection = Vector3.Lerp(dashDirection, Vector3.zero, Time.deltaTime * dashSpeed);
        }
        else
        {
            isDashing = false;
            isGravityBlocked = false;
        }
    }

    void Updraft(){
        //Debug.Log("Updrafting magnitude: " + updraftDirection.magnitude);

        if (updraftDirection.magnitude >= 0.3f)
        {
            controller.Move(updraftDirection * updraftSpeed * Time.deltaTime);
            updraftDirection = Vector3.Lerp(updraftDirection, Vector3.zero, Time.deltaTime * updraftSpeed);
        }
        else
        {
            isUpdrafting = false;
            isGravityBlocked = false;
        }
    }

    private void UpdatePlayerStats()
    {
        // Example: Update stats based on skills
        // This method would contain the logic to update the player's stats based on the acquired skills
    }


    void OnControllerColliderHit(ControllerColliderHit hit) {
        // cancel the updraft if it hits a ceiling, if the ceiling is sloped more than 45 degrees, then it should not cancel the updraft
        if (isUpdrafting || firstPersonController.jumpPressed)
        {
            // Calculate the angle between the hit normal and the upward direction of the player
            float angle = Vector3.Angle(hit.normal, Vector3.down);

            // Check if the angle indicates a nearly horizontal surface
            if (angle < 30.0f)  // You can adjust this threshold to be more or less strict
            {
                firstPersonController.RemoveVerticalVelocity();
                CancelAllSkills();
            }
        }

        if (isDashing)
        {
            // Calculate the angle between the hit normal and the direction of dash
            float dashAngle = Vector3.Angle(hit.normal, -dashDirection.normalized);
            
            // Check if the angle indicates a nearly perpendicular surface
            if (dashAngle < 30.0f)  // Adjust this threshold as needed
            {
                CancelAllSkills();
            }
        }

    }

    void CancelAllSkills()
    {
        isDashing = false;
        isUpdrafting = false;


        isGravityBlocked = false;
    }
}