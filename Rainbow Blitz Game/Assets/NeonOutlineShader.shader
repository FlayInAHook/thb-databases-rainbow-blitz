Shader "Custom/NeonEdgeShader"
{
    Properties
    {
        _NeonColor ("Neon Color", Color) = (0.0, 1.0, 1.0, 1.0)
        _EmissionStrength ("Emission Strength", Range(0, 10)) = 1
        _EdgeThickness ("Edge Thickness", Range(0.1, 10)) = 1
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata_t
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float3 worldNormal : TEXCOORD0;
                float3 viewDir : TEXCOORD1;
            };

            float4 _NeonColor;
            float _EmissionStrength;
            float _EdgeThickness;

            v2f vert (appdata_t v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.viewDir = normalize(WorldSpaceViewDir(v.vertex));
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // Edge detection based on the angle between the view direction and the normal
                float edge = 1.0 - abs(dot(i.worldNormal, i.viewDir));
                edge = smoothstep(1.0 - _EdgeThickness, 1.0, edge);

                // Apply neon color and emission based on the edge detection
                fixed4 neon = _NeonColor * edge * _EmissionStrength;

                return neon;
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}
