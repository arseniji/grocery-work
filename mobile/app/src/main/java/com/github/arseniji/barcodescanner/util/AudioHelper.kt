package com.github.arseniji.barcodescanner.util

import android.content.Context
import android.media.MediaPlayer
import com.github.arseniji.barcodescanner.R

class AudioHelper(context: Context) {
    private val beepPlayer: MediaPlayer? = try {
        MediaPlayer.create(context.applicationContext, R.raw.timer_beep)
    } catch (e: Exception) {
        null
    }

    private val notificationPlayer: MediaPlayer? = try {
        MediaPlayer.create(context.applicationContext, R.raw.notification)
    } catch (e: Exception) {
        null
    }

    fun playBeep() {
        val mp = beepPlayer ?: return
        if (mp.isPlaying) mp.seekTo(0)
        mp.start()
    }

    fun playNotification() {
        val mp = notificationPlayer ?: return
        if (mp.isPlaying) mp.seekTo(0)
        mp.start()
    }
}