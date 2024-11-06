Shader "Custom/GhostlyNeonShader"
{
  Properties
  {
      _MainTex ("Texture", 2D) = "white" {}
      _Color ("Color", Color) = (0, 1, 0, 1)
      _NoiseTex ("Noise Texture", 2D) = "white" {}
      _ScrollSpeed ("Scroll Speed", Range(0, 10)) = 1.0
      _Opacity ("Opacity", Range(0, 1)) = 0.5
  }
  SubShader
  {
      Tags { "Queue" = "Transparent" "RenderType" = "Transparent" }
      LOD 200

      Pass
      {
          CGPROGRAM
          #pragma vertex vert
          #pragma fragment frag
          #include "UnityCG.cginc"

          struct appdata
          {
              float4 vertex : POSITION;
              float2 uv : TEXCOORD0;
          };

          struct v2f
          {
              float2 uv : TEXCOORD0;
              float2 uv_noise : TEXCOORD1;
              float4 vertex : SV_POSITION;
          };

          sampler2D _MainTex;
          sampler2D _NoiseTex;
          float4 _Color;
          float _ScrollSpeed;
          float _Opacity;

          v2f vert (appdata v)
          {
              v2f o;
              o.vertex = UnityObjectToClipPos(v.vertex);
              o.uv = v.uv;
              o.uv_noise = v.uv + _Time.y * _ScrollSpeed;
              return o;
          }

          fixed4 frag (v2f i) : SV_Target
          {
              // Main texture
              fixed4 col = tex2D(_MainTex, i.uv) * _Color;

              // Noise texture
              fixed4 noise = tex2D(_NoiseTex, i.uv_noise);

              // Blend the main texture and the noise
              col.rgb += noise.rgb * col.a;

              // Apply opacity
              col.a *= _Opacity;

              return col;
          }
          ENDCG
      }
  }
  FallBack "Transparent/VertexLit"
}
