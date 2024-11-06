using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using UnityEngine;

public class FirstPersonController : MonoBehaviour
{
    private CharacterController controller;
    private CustomCharacterController customController;
    public float baseSpeed  = 10.0f;
    public float speed;
    public float airborneSpeedDecay = 2f;
    public float groundSpeedDecay = 5f;
    public float gravity = -9.81f;
    public float jumpHeight = 2.7f;

    private Camera playerCamera;
    public float lookSensitivity = 2.0f;
    public float lookXLimit = 80.0f;

    public float baseFOV = 60.0f;
    public float fovMultiplier = 1.5f;

    public Vector3 velocity;
    public bool isGrounded;
    public bool characterControllerIsGrounded;
    public bool jumpPressed;
    private float rotationX = 0;

    public bool stopGravity = false;

    

    private Collider groundCollider;

    private PlayerSkills playerSkills;

    private LevelManager levelManager;

    void Start() {
        levelManager = GameObject.Find("LevelManager").GetComponent<LevelManager>();
        controller = GetComponent<CharacterController>();
        // Lock cursor to the center of the screen
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
        playerCamera = GetComponentInChildren<Camera>();
        playerSkills = GetComponent<PlayerSkills>();
        customController = GetComponent<CustomCharacterController>();

        speed = baseSpeed;
    }

    void Update() {
        // Ground check
        if (!levelManager.canMove) return;
        isGrounded = controller.isGrounded;
        characterControllerIsGrounded = controller.isGrounded;
        if (isGrounded && velocity.y < 0.1f) {
            velocity.y = -4f;
            AdjustGroundSpeed(); // Adjust speed based on the ground type
        } else {
            // slowly clamp airborne speed to base speed
            speed = Mathf.Lerp(speed, baseSpeed, Time.deltaTime * airborneSpeedDecay);
            
        }

        if (!playerSkills.isUsingSkill) playerCamera.fieldOfView = Mathf.Lerp(playerCamera.fieldOfView, baseFOV + (speed - baseSpeed) * fovMultiplier, 6.0f * Time.deltaTime);

        // Horizontal movement
        //float x = Input.GetAxis("Horizontal");
        //float z = Input.GetAxis("Vertical");
        float x = 0;
        float z = 0;
        if (InputManager.instance.GetKey("Forward"))
        {
            z += 1;
        }
        if (InputManager.instance.GetKey("Backward"))
        {
            z -= 1;
        }
        if (InputManager.instance.GetKey("Left"))
        {
            x -= 1;
        }
        if (InputManager.instance.GetKey("Right"))
        {
            x += 1;
        }

        // Normalize movement vector to ensure consistent movement speed in all directions
        Vector3 move = transform.right * x + transform.forward * z;
        if (move.magnitude > 1) {
            move.Normalize();
        }

        controller.Move(move * speed * Time.deltaTime);


        if (!playerSkills.isGravityBlocked && !stopGravity) {
            velocity.y += gravity * Time.deltaTime;
        } else {
            velocity.y = -4f;
        }

        // Jumping
        jumpPressed = Input.GetButton("Jump");
        if (jumpPressed && isGrounded) {
            velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
        }

        

        controller.Move(velocity * Time.deltaTime);
        

        // Camera rotation
        rotationX -= Input.GetAxis("Mouse Y") * lookSensitivity * StaticInfo.SENSITIVITY;
        rotationX = Mathf.Clamp(rotationX, -lookXLimit, lookXLimit);
        playerCamera.transform.localRotation = Quaternion.Euler(rotationX, 0, 0);

        // Character rotation
        float rotationY = Input.GetAxis("Mouse X") * lookSensitivity * StaticInfo.SENSITIVITY;
        transform.Rotate(0, rotationY, 0);
    }

    /*void OnControllerColliderHit(ControllerColliderHit hit)
    {
        groundCollider = hit.collider;
    }*/

    bool IsPlayerStandingAtEdge() {
        RaycastHit hit;
        Vector3 bottom = transform.position - new Vector3(0, controller.height / 2, 0);
        if (Physics.Raycast(bottom, Vector3.down, out hit, 1f, customController.groundMask)) {
            float angle = Vector3.Angle(hit.normal, Vector3.down);
            //Debug.Log("Angle: " + angle);
            if (angle > 170) {
                return true;
            }
        }

        return false;
    }


    void AdjustGroundSpeed() {
        RaycastHit hit;
        Vector3 bottom = transform.position - new Vector3(0, controller.height / 2, 0);
        if (Physics.Raycast(bottom, Vector3.down, out hit, customController.groundCheckDistance, customController.groundMask)) {
            groundCollider = hit.collider;
        } else {
            groundCollider = null;
        }
        if (groundCollider == null) return;
        switch (groundCollider.tag)
        {
            case "SlowDown":
                float slowSpeed = baseSpeed * 0.5f;
                float initialSlowSpeed = Mathf.Min(baseSpeed * 0.6f, speed);
                speed = Mathf.Lerp(initialSlowSpeed, slowSpeed, Time.deltaTime * groundSpeedDecay * 2.0f); // Slow down on mud
                
                break;
            case "SpeedUp":
                float fastSpeed = baseSpeed * 2.0f;
                float initialFastSpeed = Mathf.Max(baseSpeed * 1.5f, speed);
                speed = Mathf.Lerp(initialFastSpeed, fastSpeed, Time.deltaTime * groundSpeedDecay * 2.0f); // Speed up on ice
                break;
            default:
                speed = Mathf.Lerp(speed, baseSpeed, Time.deltaTime * groundSpeedDecay); // Reset speed to base speed
                break;
        }
    }

    public void RemoveVerticalVelocity() {
        velocity.y = 0;
    }


}