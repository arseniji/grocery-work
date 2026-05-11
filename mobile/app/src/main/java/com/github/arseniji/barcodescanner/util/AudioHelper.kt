package com.github.arseniji.barcodescanner.util

import android.content.Context
import android.media.MediaPlayer
import com.github.arseniji.barcodescanner.R

// Синглтон в Koin — живёт пока живёт процесс, release() не вызываем
class AudioHelper(context: Context) {
    private val mediaPlayer: MediaPlayer? = try {
        MediaPlayer.create(context.applicationContext, R.raw.timer_beep)
    } catch (e: Exception) {
        null
    }

    fun playBeep() {
        val mp = mediaPlayer ?: return
        if (mp.isPlaying) mp.seekTo(0)
        mp.start()
    }
}