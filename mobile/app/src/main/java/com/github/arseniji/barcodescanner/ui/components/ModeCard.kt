    package com.github.arseniji.barcodescanner.ui.components

    import android.media.Image
    import androidx.compose.foundation.layout.Arrangement
    import androidx.compose.foundation.layout.Column
    import androidx.compose.foundation.layout.Row
    import androidx.compose.foundation.layout.fillMaxWidth
    import androidx.compose.foundation.layout.padding
    import androidx.compose.foundation.layout.size
    import androidx.compose.material3.Card
    import androidx.compose.material3.Icon
    import androidx.compose.material3.MaterialTheme
    import androidx.compose.material3.Text
    import androidx.compose.runtime.Composable
    import androidx.compose.ui.Alignment
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.graphics.vector.ImageVector
    import androidx.compose.ui.unit.dp
    import androidx.compose.ui.unit.sp

    @Composable
    fun ModeCard(
        title: String,
        subtitle: String,
        icon: ImageVector,
        onClick: () -> Unit,
        enabled: Boolean = true,
    ){
        val contentAlpha = if (enabled) 1f else 0.38f
        Card(
            onClick = onClick,
            modifier = Modifier.fillMaxWidth(),
            enabled = enabled,
        ) {
            Row(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(36.dp),
                    tint = MaterialTheme.colorScheme.primary.copy(alpha = contentAlpha),
                )
                Column {
                    Text(text = title, fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = contentAlpha))
                    Text(
                        text = subtitle,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = contentAlpha),
                    )
                }
            }
        }
    }